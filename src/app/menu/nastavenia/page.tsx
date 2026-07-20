import Link from "next/link";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { loadRegistrationHistory, subscriptionPlanInfo } from "@/lib/settings-data";
import { BellIcon, CalendarIcon, CardIcon, DocIcon, UserIcon } from "./icons";
import { MenuRow } from "./settings-ui";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const subscription = subscriptionPlanInfo(
    user.subscriptionPlan,
    user.subscriptionStatus,
  );
  const avatarUrl = user.profile?.avatarUrl ?? null;
  const registrationHistory = await loadRegistrationHistory(user.id);

  const enabledCount = [
    user.profile?.notifyNewPosts ?? true,
    user.profile?.notifyForumApproved ?? true,
    user.profile?.notifyForumReactions ?? true,
    user.profile?.notifyEventsNearby ?? true,
  ].filter(Boolean).length;

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu" title="Nastavenia" />

        <section className="px-5 pt-1 pb-4">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple to-brand-pink p-5 text-white shadow-soft">
            <div className="flex items-center gap-4">
              <div
                aria-hidden
                className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-cover bg-center ring-2 ring-white/30"
                style={profileAvatarStyle(avatarUrl)}
              >
                {!avatarUrl?.trim() && (
                  <span className="text-xl font-bold">{initials(user.fullName)}</span>
                )}
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

        <nav aria-label="Nastavenia účtu">
          <MenuRow
            href="/menu/nastavenia/ucet"
            icon={<UserIcon />}
            title="Účet"
            subtitle="Meno, e-mail, heslo"
          />
          <MenuRow
            href="/menu/nastavenia/notifikacie"
            icon={<BellIcon />}
            title="Notifikácie"
            subtitle={`${enabledCount} z 4 typov oznámení je zapnutých`}
          />
          <MenuRow
            href="/menu/nastavenia/predplatne"
            icon={<CardIcon />}
            title="Predplatné"
            subtitle={subscription.label}
          />
          <MenuRow
            href="/menu/nastavenia/registracie"
            icon={<CalendarIcon />}
            title="História registrácií"
            subtitle={
              registrationHistory.length > 0
                ? `${registrationHistory.length} ${registrationHistory.length === 1 ? "registrácia" : registrationHistory.length < 5 ? "registrácie" : "registrácií"} na podujatia`
                : "Zatiaľ bez registrácií"
            }
          />
          <MenuRow
            href="/menu/nastavenia/pravne"
            icon={<DocIcon />}
            title="Právne informácie"
            subtitle="Dokumenty a zásady"
          />
        </nav>

        <div aria-hidden className="h-10 shrink-0" />
      </div>
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
