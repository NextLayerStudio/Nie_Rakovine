import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * TEMPORARY — sandbox-only testing helper for the Nexi renewal cron.
 * Only ever touches the CALLER's own account (never an arbitrary userId),
 * and only backdates subscriptionEnd so the cron picks it up as "due".
 * Removed once the renewal flow is verified end-to-end.
 */
export async function POST() {
  if (!process.env.NEXI_BASE_URL?.includes("sandbox")) {
    return new Response("Only available against the Nexi sandbox", { status: 403 });
  }

  const user = await requireUser();

  if (!user.nexiContractId || user.subscriptionPlan === "FREE") {
    return Response.json(
      { error: "Account has no active Nexi recurring contract to backdate" },
      { status: 400 },
    );
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.user.update({
    where: { id: user.id },
    data: { subscriptionEnd: yesterday },
  });

  return Response.json({ ok: true, subscriptionEnd: yesterday.toISOString() });
}
