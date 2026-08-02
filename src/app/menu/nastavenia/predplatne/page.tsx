import Link from "next/link";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import { requireUser } from "@/lib/auth";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { subscriptionPlanInfo } from "@/lib/settings-data";
import { isPremiumMember } from "@/lib/membership";
import { cn } from "@/lib/utils";
import { TrialButton } from "./TrialButton";

export const dynamic = "force-dynamic";

export default async function SubscriptionSettingsPage() {
  const user = await requireUser();
  const subscription = subscriptionPlanInfo(
    user.subscriptionPlan,
    user.subscriptionStatus,
  );
  const premium = isPremiumMember(user.subscriptionPlan, user.subscriptionStatus);
  const isTrial = premium && user.subscriptionPlan === "TRIAL";
  const trialEligible = !premium && !user.trialUsedAt;
  const trialDaysLeft =
    isTrial && user.subscriptionEnd
      ? Math.max(
          0,
          Math.ceil(
            (user.subscriptionEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          ),
        )
      : null;

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu/nastavenia" title="Predplatné" />

        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div>
            <p className="text-sm font-semibold text-brand-purple">
              {subscription.label}
            </p>
            <p className="mt-0.5 text-xs text-brand-purple/60">
              {isTrial
                ? `Skúšobné obdobie končí o ${trialDaysLeft} ${trialDaysLeft === 1 ? "deň" : trialDaysLeft && trialDaysLeft < 5 ? "dni" : "dní"}.`
                : subscription.active
                  ? "Máte prístup k prémiovému obsahu."
                  : "Predplatné môžete aktivovať kedykoľvek."}
            </p>
          </div>
          <span
            className={cn(
              "h-3 w-3 shrink-0 rounded-full",
              subscription.active ? "bg-emerald-500" : "bg-brand-purple/25",
            )}
            aria-hidden
          />
        </div>

        {/* Skúšobné obdobie / Upgrade CTA */}
        <div className="px-5 pb-5">
          {trialEligible && (
            <div className="rounded-2xl border border-brand-pink/25 bg-brand-pink/5 p-4">
              <p className="text-sm font-bold text-brand-purple">
                Vyskúšajte plné členstvo na 14 dní zadarmo
              </p>
              <p className="mt-1 text-xs leading-relaxed text-brand-purple/65">
                Získate prístup do ONKO knižnice a možnosť prihlasovať sa na
                podujatia, bez akéhokoľvek záväzku. Skúšobné obdobie je možné
                využiť len raz.
              </p>
              <div className="mt-3">
                <TrialButton />
              </div>
            </div>
          )}

          {!premium && !trialEligible && (
            <Link
              href="/register/subscription?upgrade=1"
              className="btn-primary block w-full py-3 text-center text-sm"
            >
              Upgradovať členstvo
            </Link>
          )}

          {premium && (
            <Link
              href="/register/subscription?upgrade=1"
              className="btn-secondary block w-full py-3 text-center text-sm"
            >
              Zmeniť formu členstva
            </Link>
          )}
        </div>

        <div className="px-5 pb-12">
          <p className="mb-1 mt-3 text-xs font-bold uppercase tracking-wide text-brand-purple/45">
            Typy členstva
          </p>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent =
              subscription.active && user.subscriptionPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={cn(
                  "flex items-start justify-between gap-3 border-b border-brand-purple/8 py-4 last:border-b-0",
                  isCurrent && "-mx-3 rounded-2xl border-b-0 bg-brand-pink/8 px-3",
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-brand-purple">
                      {plan.name}
                    </p>
                    {isCurrent && (
                      <span className="shrink-0 rounded-pill bg-brand-pink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Aktuálne
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-brand-purple/60">
                    {plan.description}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-brand-purple">
                  {plan.price}
                </span>
              </div>
            );
          })}
          {isTrial && (
            <div className="mt-2 flex items-start justify-between gap-3 rounded-2xl bg-brand-pink/8 px-3 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-brand-purple">
                    Skúšobné obdobie
                  </p>
                  <span className="shrink-0 rounded-pill bg-brand-pink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Aktuálne
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-brand-purple/60">
                  14 dní plného prístupu zadarmo, bez platby.
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold text-brand-purple">
                0 €
              </span>
            </div>
          )}
        </div>

        <DeleteAccountSection email={user.email} />

        <div aria-hidden className="h-10 shrink-0" />
      </div>
    </PhoneShell>
  );
}
