import type { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

const PREMIUM_PLANS: SubscriptionPlan[] = ["MONTHLY", "YEARLY", "SUPPORTER"];

/**
 * Free (and NONE/inactive) accounts are official NIE RAKOVINE members but
 * don't get ONKO knižnica access or event registration — see cenník: those
 * are the paid-tier extras on top of the shared Free benefits.
 */
export function isPremiumMember(
  plan: SubscriptionPlan,
  status: SubscriptionStatus,
): boolean {
  return status === "ACTIVE" && PREMIUM_PLANS.includes(plan);
}
