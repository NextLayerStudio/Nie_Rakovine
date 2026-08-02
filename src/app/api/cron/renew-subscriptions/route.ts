import { prisma } from "@/lib/prisma";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { createMitCharge, generateNexiOrderId, isNexiOrderPaid, nexiConfigured } from "@/lib/nexi";
import { queuePaymentConfirmedEmail, queueRenewalFailedEmail } from "@/lib/email/send";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Renewal loop over all due members can take a while — this is a Vercel
// Cron-only route, not something a user waits on in the browser.
export const maxDuration = 300;

function planLabel(plan: string): string {
  return SUBSCRIPTION_PLANS.find((p) => p.id === plan)?.name ?? plan;
}

function planPriceEuro(plan: string): number {
  return SUBSCRIPTION_PLANS.find((p) => p.id === plan)?.priceEuro ?? 0;
}

/**
 * Daily job (Vercel Cron, see vercel.json) — charges every Monthly/Yearly
 * member whose subscriptionEnd has passed via Nexi's MIT recurring-charge
 * API (POST /orders/mit, no 3D Secure / customer interaction).
 *
 * V1 policy, as agreed: a single attempt per day. On failure the member is
 * simply downgraded to Free (no multi-attempt dunning) — they keep official
 * NIE RAKOVINE membership, just lose the paid-tier extras, and can
 * resubscribe any time from the app.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!nexiConfigured()) {
    return Response.json({ skipped: "NEXI not configured" });
  }

  const dueUsers = await prisma.user.findMany({
    where: {
      subscriptionStatus: "ACTIVE",
      paymentMethod: "CARD",
      nexiContractId: { not: null },
      subscriptionPlan: { in: ["MONTHLY", "YEARLY"] },
      subscriptionEnd: { lte: new Date() },
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      subscriptionPlan: true,
      nexiContractId: true,
    },
  });

  let renewed = 0;
  let downgraded = 0;
  const errors: { userId: string; error: string }[] = [];

  for (const user of dueUsers) {
    const plan = user.subscriptionPlan;
    const contractId = user.nexiContractId;
    if (!contractId) continue; // satisfies TS; excluded by the query already

    try {
      const orderId = generateNexiOrderId("mit");
      const amountEuro = planPriceEuro(plan);
      const status = await createMitCharge({
        orderId,
        contractId,
        amountEuroCents: Math.round(amountEuro * 100),
        description: `ONKO KLUB - obnovenie (${planLabel(plan)})`,
      });

      if (isNexiOrderPaid(status)) {
        const now = new Date();
        const end = new Date(now);
        if (plan === "MONTHLY") end.setMonth(end.getMonth() + 1);
        if (plan === "YEARLY") end.setFullYear(end.getFullYear() + 1);

        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionEnd: end },
        });

        queuePaymentConfirmedEmail({
          email: user.email,
          fullName: user.fullName,
          planLabel: planLabel(plan),
          amountEuro,
        });
        renewed++;
        continue;
      }

      // Declined / failed — downgrade to Free, same shape as a fresh Free
      // registration (selectSubscriptionPlanAction).
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlan: "FREE",
          subscriptionStatus: "ACTIVE",
          subscriptionStart: new Date(),
          subscriptionEnd: null,
          nexiContractId: null,
        },
      });
      queueRenewalFailedEmail({
        email: user.email,
        fullName: user.fullName,
        planLabel: planLabel(plan),
      });
      downgraded++;
    } catch (err) {
      console.error("[renew-subscriptions] failed for user", user.id, err);
      errors.push({
        userId: user.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return Response.json({
    checked: dueUsers.length,
    renewed,
    downgraded,
    errors,
  });
}
