"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserForAction } from "@/lib/auth";
import { prismaActionError, requireActionUser } from "@/lib/safe-action";

export async function toggleProfileFollowAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;
  const user = auth.user;

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
        message: prismaActionError(
          err,
          "Nepodarilo sa zmeniť sledovanie. Skúste to znova.",
        ),
      };
    }
  }

  return { ok: true };
}
