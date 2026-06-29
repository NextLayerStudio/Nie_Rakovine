"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { prismaActionError, requireActionUser } from "@/lib/safe-action";

export async function toggleEventLikeAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;
  const user = auth.user;

  const eventId = String(formData.get("eventId") ?? "");
  if (!eventId) return { ok: false, message: "Chýba akcia." };

  try {
    const existing = await prisma.eventLike.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });

    if (existing) {
      await prisma.eventLike.delete({
        where: { userId_eventId: { userId: user.id, eventId } },
      });
    } else {
      await prisma.eventLike.create({
        data: { userId: user.id, eventId },
      });
    }
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // already liked
    } else {
      return {
        ok: false,
        message: prismaActionError(err, "Nepodarilo sa uložiť reakciu."),
      };
    }
  }

  return { ok: true };
}
