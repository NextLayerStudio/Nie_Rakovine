import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { DiscountCardWithAvatarUpload } from "@/components/membership/DiscountCardWithAvatarUpload";
import { NoScreenshotGuard } from "@/components/membership/NoScreenshotGuard";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { membershipSubscriptionInfo } from "@/lib/membership-card";

export const dynamic = "force-dynamic";

export default async function DiscountMembershipCardPage() {
  const user = await requireUser();
  const subscription = membershipSubscriptionInfo(user);

  return (
    <PhoneShell>
      <NoScreenshotGuard fullPage className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
          <TopBar backHref="/menu" title="Moja zľavová karta" />

          <section className="px-5 py-4">
            <DiscountCardWithAvatarUpload
              fullName={user.fullName}
              userId={user.id}
              initialAvatarUrl={user.profile?.avatarUrl ?? null}
              subscription={subscription}
            />

            <p className="mt-4 text-center text-[11px] leading-relaxed text-brand-purple/55">
              Táto karta je určená na preukázanie členstva pri uplatnení zliav.
              Obsah stránky je chránený pred kopírovaním a snímaním obrazovky.
            </p>

            {!subscription.active && (
              <div className="mt-4 rounded-2xl border border-brand-pink/30 bg-brand-pink-soft/40 px-4 py-3 text-center">
                <p className="text-xs font-semibold text-brand-purple">
                  Predplatné nie je aktívne
                </p>
                <p className="mt-1 text-[11px] text-brand-purple/65">
                  Pre plné využitie zliav aktivujte predplatné v nastaveniach.
                </p>
                <Link
                  href="/menu/nastavenia"
                  className="mt-3 inline-flex rounded-pill bg-brand-pink px-4 py-2 text-xs font-bold text-white"
                >
                  Nastavenia predplatného
                </Link>
              </div>
            )}

            {subscription.active && (
              <Link
                href="/home/zlavy"
                className="mt-5 flex w-full items-center justify-center rounded-pill bg-brand-purple py-3 text-sm font-bold text-white"
              >
                Prejsť na zľavy
              </Link>
            )}
          </section>
        </div>
      </NoScreenshotGuard>
      <BottomNav />
    </PhoneShell>
  );
}
