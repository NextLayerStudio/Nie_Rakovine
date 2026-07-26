"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { subscriptionPlanLabel } from "@/lib/user-profile-display";
import { queuePaymentConfirmedEmail } from "@/lib/email/send";
import type { SubscriptionStatus } from "@prisma/client";

/** Admin marks a bank-transfer payment as received — activates the membership. */
export async function confirmBankTransferPaymentAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      fullName: true,
      subscriptionPlan: true,
      paymentAmountEuro: true,
      paymentMethod: true,
    },
  });
  if (!user || user.paymentMethod !== "BANK_TRANSFER") return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: "ACTIVE" satisfies SubscriptionStatus,
      paymentConfirmedAt: new Date(),
    },
  });

  queuePaymentConfirmedEmail({
    email: user.email,
    fullName: user.fullName,
    planLabel: subscriptionPlanLabel(user.subscriptionPlan),
    amountEuro: user.paymentAmountEuro ?? 0,
  });

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin/users");
}
