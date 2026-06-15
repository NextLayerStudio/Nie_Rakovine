import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { SettingsForms } from "./SettingsForms";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const subscription = planInfo(user.subscriptionPlan, user.subscriptionStatus);

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu" title="Nastavenia" />

        <section className="px-5 pt-1 pb-2">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple to-brand-pink p-5 text-white shadow-soft">
            <div className="flex items-center gap-4">
              <div
                aria-hidden
                className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/20 ring-2 ring-white/30"
              >
                <span className="text-xl font-bold">
                  {initials(user.fullName)}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold">{user.fullName}</h2>
                <p className="truncate text-xs text-white/75">{user.email}</p>
                <span className="mt-2 inline-block rounded-pill bg-white/20 px-3 py-0.5 text-[10px] font-semibold">
                  {subscription.label}
                </span>
              </div>
            </div>
            <Link
              href="/profile"
              className="mt-4 flex w-full items-center justify-center rounded-pill bg-white/15 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
            >
              Zobraziť môj profil
            </Link>
          </div>
        </section>

        <section className="px-5 pb-24">
          <SettingsForms
            fullName={user.fullName}
            email={user.email}
            consentNewsletter={user.profile?.consentNewsletter ?? false}
            notifyRadiusKm={user.profile?.notifyRadiusKm ?? 50}
            subscriptionActive={subscription.active}
          />
        </section>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function planInfo(plan: string, status: string) {
  const active = status === "ACTIVE";
  if (!active) return { label: "Neaktívne predplatné", active: false };
  switch (plan) {
    case "MONTHLY":
      return { label: "Mesačné predplatné", active: true };
    case "YEARLY":
      return { label: "Ročné predplatné", active: true };
    default:
      return { label: "Bez predplatného", active: false };
  }
}
