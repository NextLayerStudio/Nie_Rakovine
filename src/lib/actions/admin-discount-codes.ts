"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { DiscountCodeType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type ActionState = { ok: boolean; message?: string };

function parseType(raw: string): DiscountCodeType | null {
  return raw === "PERCENT" || raw === "FIXED" ? raw : null;
}

export async function createDiscountCodeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = parseType(String(formData.get("type") ?? ""));
  const amount = Number(formData.get("amount") ?? 0);
  const active = formData.get("active") === "on";

  if (!code || !type || !Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Vyplňte kód, typ zľavy a kladnú výšku zľavy." };
  }
  if (type === "PERCENT" && amount > 100) {
    return { ok: false, message: "Percentuálna zľava môže byť najviac 100." };
  }

  const exists = await prisma.membershipDiscountCode.findUnique({ where: { code } });
  if (exists) {
    return { ok: false, message: "Tento kód už existuje." };
  }

  await prisma.membershipDiscountCode.create({
    data: { code, type, amount, active },
  });

  revalidatePath("/admin/discount-codes");
  redirect("/admin/discount-codes");
}

export async function updateDiscountCodeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = parseType(String(formData.get("type") ?? ""));
  const amount = Number(formData.get("amount") ?? 0);
  const active = formData.get("active") === "on";

  if (!id || !code || !type || !Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Vyplňte kód, typ zľavy a kladnú výšku zľavy." };
  }
  if (type === "PERCENT" && amount > 100) {
    return { ok: false, message: "Percentuálna zľava môže byť najviac 100." };
  }

  const conflict = await prisma.membershipDiscountCode.findFirst({
    where: { code, NOT: { id } },
  });
  if (conflict) {
    return { ok: false, message: "Tento kód je už použitý iným záznamom." };
  }

  await prisma.membershipDiscountCode.update({
    where: { id },
    data: { code, type, amount, active },
  });

  revalidatePath("/admin/discount-codes");
  redirect("/admin/discount-codes");
}

export async function toggleDiscountCodeActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const current = formData.get("current") === "true";
  if (!id) return;
  await prisma.membershipDiscountCode.update({
    where: { id },
    data: { active: !current },
  });
  revalidatePath("/admin/discount-codes");
}

export async function deleteDiscountCodeAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.membershipDiscountCode.delete({ where: { id } });
  revalidatePath("/admin/discount-codes");
}
