"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserForAction } from "@/lib/auth";

export async function toggleProfileFollowAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const user = await getSessionUserForAction();
  if (!user) {
    return { ok: false, message: "Prihláste sa prosím znova." };
  }

  const profileId = String(formData.get("profileId") ?? "").trim();
  const handle = String(formData.get("handle") ?? "").trim();
  if (!profileId) {
    return { ok: false, message: "Chýba profil." };
  }

  const profile = await prisma.clubProfile.findUnique({
    where: { id: profileId },
    select: { id: true, handle: true },
  });
  if (!profile) {
    return { ok: false, message: "Profil neexistuje." };
  }

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
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // already following (double click)
    } else {
      console.error("[toggleProfileFollowAction]", err);
      return {
        ok: false,
        message:
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2021"
            ? "Databáza nie je pripravená. Skontrolujte migrácie na Verceli."
            : "Nepodarilo sa zmeniť sledovanie. Skúste to znova.",
      };
    }
  }

  const profileHandle = handle || profile.handle;
  revalidatePath("/home");
  revalidatePath("/home/search");
  revalidatePath("/home/profiles");
  revalidatePath("/home/notifications");
  revalidatePath(`/home/profiles/${profileHandle}`);

  return { ok: true };
}
