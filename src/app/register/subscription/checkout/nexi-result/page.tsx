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
  searchParams: Promise<{ orderId?: string; upgrade?: string }>;
}) {
  await requireUser();
  const { orderId, upgrade } = await searchParams;
  const isUpgrade = upgrade === "1";

  if (!orderId) {
    redirect("/register/subscription/checkout?error=missing_order");
  }

  const result = await finalizeNexiSubscriptionOrder(orderId);

  if (result.activated) {
    // Existing members upgrading from Nastavenia go back there, not into
    // the registration wizard. Otherwise: Supporters aren't patients — they
    // skip the location/diagnosis/interests steps entirely, same as the
    // bank-transfer and instant-activate paths.
    redirect(
      isUpgrade
        ? "/menu/nastavenia/predplatne"
        : result.plan === "SUPPORTER"
          ? "/register/profile/done"
          : "/register/profile/location",
    );
  }

  if (result.pending) {
    redirect("/register/subscription/checkout?error=payment_pending");
  }

  redirect("/register/subscription/checkout?error=payment_failed");
}
