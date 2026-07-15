import "server-only";

import { prisma } from "@/lib/prisma";

export type DiscountCodeResult =
  | { ok: true; finalPriceEuro: number; codeId: string; discountLabel: string }
  | { ok: false; message: string };

function computeFinalPrice(
  priceEuro: number,
  type: "PERCENT" | "FIXED",
  amount: number,
): number {
  const reduced =
    type === "PERCENT" ? priceEuro * (1 - amount / 100) : priceEuro - amount;
  return Math.max(0, Math.round(reduced * 100) / 100);
}

/** Validate a membership discount code against a plan's base price. */
export async function validateDiscountCode(
  rawCode: string,
  priceEuro: number,
): Promise<DiscountCodeResult> {
  const code = rawCode.trim();
  if (!code) {
    return { ok: false, message: "Zadajte zľavový kód." };
  }

  const record = await prisma.membershipDiscountCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!record || !record.active) {
    return { ok: false, message: "Neplatný alebo neaktívny zľavový kód." };
  }

  const finalPriceEuro = computeFinalPrice(priceEuro, record.type, record.amount);
  const discountLabel =
    record.type === "PERCENT" ? `-${record.amount} %` : `-${record.amount} €`;

  return { ok: true, finalPriceEuro, codeId: record.id, discountLabel };
}

/** Re-validate and record usage — call only at final payment confirmation. */
export async function redeemDiscountCode(
  rawCode: string,
  priceEuro: number,
): Promise<DiscountCodeResult> {
  const result = await validateDiscountCode(rawCode, priceEuro);
  if (!result.ok) return result;

  await prisma.membershipDiscountCode.update({
    where: { id: result.codeId },
    data: { usedCount: { increment: 1 } },
  });

  return result;
}
