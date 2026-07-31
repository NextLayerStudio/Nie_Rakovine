import { finalizeNexiSubscriptionOrder } from "@/lib/nexi-checkout";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Server-to-server notification from Nexi (POST /orders/hpp's
 * notificationUrl). The exact payload shape isn't documented anywhere we
 * could find, so we don't trust anything in the body except as a hint of
 * which orderId to look at — the actual outcome always comes from our own
 * GET /orders/{orderId} call inside finalizeNexiSubscriptionOrder.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const orderId: string | undefined =
    body?.order?.orderId ?? body?.orderId ?? body?.operation?.orderId ?? undefined;

  if (!orderId) {
    console.error("[nexi-notification] no orderId found in payload", body);
    // 200 anyway — nothing useful we can retry on, and returning an error
    // would just make Nexi resend the same unparseable payload.
    return Response.json({ ok: true });
  }

  try {
    await finalizeNexiSubscriptionOrder(orderId);
  } catch (err) {
    console.error("[nexi-notification] finalize failed", orderId, err);
  }

  return Response.json({ ok: true });
}
