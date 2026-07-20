import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { subscriptionPlanInfo } from "@/lib/settings-data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SubscriptionSettingsPage() {
  const user = await requireUser();
  const subscription = subscriptionPlanInfo(
    user.subscriptionPlan,
    user.subscriptionStatus,
  );

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
              {subscription.active
                ? "Máte prístup k prémiovému obsahu."
                : "Predplatné môžete aktivovať pri registrácii."}
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
        </div>
      </div>
    </PhoneShell>
  );
}
