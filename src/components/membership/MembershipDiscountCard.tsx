"use client";

import { profileAvatarStyle } from "@/lib/avatar-style";
import {
  nameInitials,
  type MembershipSubscriptionInfo,
} from "@/lib/membership-card";
import { membershipBarcode } from "@/lib/profile-page";
import { cn } from "@/lib/utils";

export function MembershipDiscountCard({
  fullName,
  userId,
  avatarUrl,
  subscription,
  className,
  onPhotoClick,
}: {
  fullName: string;
  userId: string;
  avatarUrl?: string | null;
  subscription: MembershipSubscriptionInfo;
  className?: string;
  onPhotoClick?: () => void;
}) {
  const memberNumber = membershipBarcode(userId);
  const initials = nameInitials(fullName);

  return (
    <article
      className={cn(
        "membership-card relative aspect-[1.72/1] w-full overflow-hidden rounded-[26px] shadow-card",
        className,
      )}
      aria-label="Zľavová karta ONKO KLUBU"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-[#faf4f7] via-white to-[#f3ebf6]"
      />
      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand-pink/[0.07] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-8 -left-6 h-28 w-28 rounded-full bg-brand-purple/[0.05] blur-2xl"
      />

      <div className="relative flex h-full flex-col px-6 pb-5 pt-6">
        <div className="flex items-center gap-5">
          <ProfilePhotoCircle
            avatarUrl={avatarUrl}
            initials={initials}
            onPhotoClick={onPhotoClick}
          />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-purple/45">
              ONKO KLUB
            </p>
            <h2 className="mt-1.5 text-[21px] font-bold leading-[1.15] tracking-tight text-brand-purple">
              {fullName}
            </h2>
            <span
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]",
                subscription.active
                  ? "bg-emerald-500/10 text-emerald-800 ring-1 ring-emerald-500/15"
                  : "bg-brand-purple/[0.06] text-brand-purple/55 ring-1 ring-brand-purple/10",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  subscription.active ? "bg-emerald-500" : "bg-brand-purple/30",
                )}
              />
              {subscription.active ? "Aktívne predplatné" : "Neaktívne predplatné"}
            </span>
          </div>
        </div>

        <div className="mt-auto border-t border-brand-purple/[0.08] pt-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-purple/40">
            Číslo člena
          </p>
          <p
            className="membership-card-id mt-1.5 font-mono text-[14px] font-semibold text-brand-purple"
            aria-label={`Číslo člena ${memberNumber}`}
          >
            {memberNumber.split(" ").map((group, i) => (
              <span key={`${group}-${i}`} className="membership-card-id-group">
                {group}
              </span>
            ))}
          </p>
        </div>
      </div>
    </article>
  );
}

function ProfilePhotoCircle({
  avatarUrl,
  initials,
  onPhotoClick,
}: {
  avatarUrl?: string | null;
  initials: string;
  onPhotoClick?: () => void;
}) {
  const photo = (
    <div className="rounded-full bg-gradient-to-br from-brand-pink/40 to-brand-purple/30 p-[3px] shadow-[0_4px_16px_rgba(111,35,128,0.14)]">
      <div
        aria-hidden
        className="h-[96px] w-[96px] overflow-hidden rounded-full bg-cover bg-center ring-2 ring-white"
        style={profileAvatarStyle(avatarUrl)}
      >
        {!avatarUrl?.trim() && (
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-pink to-brand-purple text-2xl font-bold text-white">
            {initials}
          </span>
        )}
      </div>
    </div>
  );

  if (!onPhotoClick) {
    return <div className="shrink-0">{photo}</div>;
  }

  return (
    <button
      type="button"
      onClick={onPhotoClick}
      aria-label="Zmeniť profilovú fotografiu"
      className="group relative shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
    >
      {photo}
      <span className="pointer-events-none absolute inset-[3px] flex items-center justify-center rounded-full bg-brand-purple/0 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="rounded-pill bg-brand-purple/85 px-2.5 py-1 text-[9px] font-semibold text-white shadow-sm">
          Upraviť
        </span>
      </span>
    </button>
  );
}
