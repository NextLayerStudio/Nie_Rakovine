"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function toggleProfileFollowAction(
  formData: FormData,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const profileId = String(formData.get("profileId") ?? "").trim();
  const handle = String(formData.get("handle") ?? "").trim();
  if (!profileId) return;

  const profile = await prisma.clubProfile.findUnique({
    where: { id: profileId },
    select: { id: true, handle: true },
  });
  if (!profile) return;

  try {
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
  } catch (err) {
    // Double-click / race: second create hits unique constraint — treat as success.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // already following
    } else {
      console.error("[toggleProfileFollowAction]", err);
      return;
    }
  }

  const profileHandle = handle || profile.handle;
  revalidatePath("/home");
  revalidatePath("/home/search");
  revalidatePath("/home/profiles");
  revalidatePath("/home/notifications");
  revalidatePath(`/home/profiles/${profileHandle}`);
}
