import { prisma } from "@/lib/prisma";
import { getOrderStatus, isNexiOrderFailed, isNexiOrderPaid } from "@/lib/nexi";
import type { SubscriptionPlan } from "@prisma/client";

export type FinalizeResult = {
  activated: boolean;
  pending: boolean;
  plan?: SubscriptionPlan;
};

/**
 * Called both when the customer returns from the Nexi Hosted Payment Page
 * (resultUrl) and when Nexi's server-to-server notification arrives —
 * either way we don't trust the caller, we re-check the real status
 * ourselves via GET /orders/{orderId} before touching membership state.
 */
export async function finalizeNexiSubscriptionOrder(
  orderId: string,
): Promise<FinalizeResult> {
  const user = await prisma.user.findUnique({
    where: { pendingNexiOrderId: orderId },
    select: { id: true, pendingNexiPlan: true },
  });

  // Already finalized by the other caller (result page vs notification racing
  // each other), or an order we don't recognise — nothing to do.
  if (!user || !user.pendingNexiPlan) return { activated: false, pending: false };

  const status = await getOrderStatus(orderId);

  if (isNexiOrderPaid(status)) {
    const plan = user.pendingNexiPlan;
    const now = new Date();
    const end = new Date(now);
    if (plan === "MONTHLY") end.setMonth(end.getMonth() + 1);
    if (plan === "YEARLY") end.setFullYear(end.getFullYear() + 1);
    if (plan === "SUPPORTER") end.setFullYear(end.getFullYear() + 1);

    // Only Monthly/Yearly ever get auto-renewed by the cron — Supporter is a
    // one-off donation (possibly via Apple Pay, which Nexi doesn't support
    // for recurring/MIT charges anyway), so it gets no recurring contract.
    const isRecurring = plan === "MONTHLY" || plan === "YEARLY";

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionPlan: plan,
        subscriptionStatus: "ACTIVE",
        subscriptionStart: now,
        subscriptionEnd: end,
        paymentMethod: "CARD",
        nexiContractId: isRecurring ? orderId : undefined,
        pendingNexiOrderId: null,
        pendingNexiSecurityToken: null,
        pendingNexiPlan: null,
      },
    });
    return { activated: true, pending: false, plan };
  }

  if (isNexiOrderFailed(status)) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        pendingNexiOrderId: null,
        pendingNexiSecurityToken: null,
        pendingNexiPlan: null,
      },
    });
    return { activated: false, pending: false };
  }

  // Still PENDING (e.g. 3DS in progress) — leave pending fields as-is,
  // the notification (or a later visit to the result page) will resolve it.
  return { activated: false, pending: true };
}
