"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function toggleProfileFollowAction(
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const profileId = String(formData.get("profileId") ?? "");
  if (!profileId) return;

  const existing = await prisma.profileFollow.findUnique({
    where: { userId_profileId: { userId: user.id, profileId } },
  });

  if (existing) {
    await prisma.profileFollow.delete({
      where: { userId_profileId: { userId: user.id, profileId } },
    });
  } else {
    await prisma.profileFollow.create({
      data: { userId: user.id, profileId },
    });
  }

  revalidatePath("/home");
  revalidatePath("/home/profiles");
  revalidatePath("/home/notifications");
  revalidatePath(`/home/profiles/${formData.get("handle") ?? ""}`);
}
