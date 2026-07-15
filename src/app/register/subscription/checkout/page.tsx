import { redirect } from "next/navigation";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default async function SubscriptionCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; amount?: string }>;
}) {
  await requireUser();
  const { plan, amount } = await searchParams;

  // FREE has no payment step — selectSubscriptionPlanAction activates it
  // directly and never sends anyone here.
  const selected = SUBSCRIPTION_PLANS.find(
    (p) => p.id === plan && p.id !== "FREE",
  );
  if (!selected) {
    redirect("/register/subscription");
  }

  // Carries a Supporter amount picked on a public marketing page (e.g. the
  // /cennik slider) straight through, whether the visitor just registered
  // or logged into an existing account via /welcome.
  const parsedAmount = amount ? Number(amount) : NaN;
  const initialAmount = Number.isFinite(parsedAmount) ? parsedAmount : undefined;

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/register/subscription" title="Platba" />

        <header className="shrink-0 px-6 pt-2 text-center">
          <h1 className="text-[22px] font-extrabold leading-tight text-brand-pink">
            Dokončite platbu
          </h1>
          <p className="mx-auto mt-4 max-w-[320px] text-center text-sm leading-relaxed text-brand-purple/75">
            Posledný krok — bezpečná online platba cez GoPay.
          </p>
        </header>

        <CheckoutForm plan={selected} initialAmount={initialAmount} />
      </div>
    </PhoneShell>
  );
}
