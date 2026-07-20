import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
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

        <div className="flex items-center justify-between px-5 py-4">
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
      </div>
    </PhoneShell>
  );
}
