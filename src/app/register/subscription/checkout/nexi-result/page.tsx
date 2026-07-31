import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { finalizeNexiSubscriptionOrder } from "@/lib/nexi-checkout";

export const dynamic = "force-dynamic";

/**
 * Landing page the customer returns to from the Nexi Hosted Payment Page
 * (resultUrl). We never trust the mere fact that they landed here — we
 * re-check the real order status via GET /orders/{orderId} before
 * activating anything.
 */
export default async function NexiResultPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  await requireUser();
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/register/subscription/checkout?error=missing_order");
  }

  const result = await finalizeNexiSubscriptionOrder(orderId);

  if (result.activated) {
    // Supporters aren't patients — they skip the location/diagnosis/interests
    // steps entirely, same as the bank-transfer and instant-activate paths.
    redirect(
      result.plan === "SUPPORTER"
        ? "/register/profile/done"
        : "/register/profile/location",
    );
  }

  if (result.pending) {
    redirect("/register/subscription/checkout?error=payment_pending");
  }

  redirect("/register/subscription/checkout?error=payment_failed");
}
