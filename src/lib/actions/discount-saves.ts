"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionUser } from "@/lib/safe-action";

export async function toggleSavedDiscountOfferAction(formData: FormData) {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false as const };

  const offerId = String(formData.get("offerId") ?? "");
  if (!offerId) return { ok: false as const };

  const existing = await prisma.savedDiscountOffer.findUnique({
    where: { userId_offerId: { userId: auth.user.id, offerId } },
  });

  if (existing) {
    await prisma.savedDiscountOffer.delete({ where: { id: existing.id } });
  } else {
    await prisma.savedDiscountOffer.create({
      data: { userId: auth.user.id, offerId },
    });
  }

  revalidatePath("/home/zlavy");
  return { ok: true as const, saved: !existing };
}
