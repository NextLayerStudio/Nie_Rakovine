"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { profileAvatarStyle } from "@/lib/avatar-style";
import {
  nameInitials,
  type MembershipSubscriptionInfo,
} from "@/lib/membership-card";
import { membershipBarcode } from "@/lib/profile-page";

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
  const [zoomed, setZoomed] = useState(false);
  const memberNumber = membershipBarcode(userId);
  const memberNumberRaw = memberNumber.replace(/\s/g, "");
  const initials = nameInitials(fullName);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setZoomed(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setZoomed(true);
          }
        }}
        className={`block w-full cursor-pointer text-left${className ? ` ${className}` : ""}`}
        aria-label="Zobraziť zľavovú kartu"
      >
        <CardFace
          fullName={fullName}
          initials={initials}
          avatarUrl={avatarUrl}
          subscription={subscription}
          memberNumber={memberNumber}
          memberNumberRaw={memberNumberRaw}
          qrSize={68}
          onPhotoClick={(e) => {
            e.stopPropagation();
            onPhotoClick?.();
          }}
        />
      </div>

      {zoomed &&
        typeof document !== "undefined" &&
        createPortal(
          <ZoomModal
            fullName={fullName}
            initials={initials}
            avatarUrl={avatarUrl}
            subscription={subscription}
            memberNumber={memberNumber}
            memberNumberRaw={memberNumberRaw}
            onClose={() => setZoomed(false)}
          />,
          document.body,
        )}
    </>
  );
}

/* ── Card face (shared between inline and modal) ── */

function CardFace({
  fullName,
  initials,
  avatarUrl,
  subscription,
  memberNumber,
  memberNumberRaw,
  qrSize,
  onPhotoClick,
}: {
  fullName: string;
  initials: string;
  avatarUrl?: string | null;
  subscription: MembershipSubscriptionInfo;
  memberNumber: string;
  memberNumberRaw: string;
  qrSize: number;
  onPhotoClick?: (e: React.MouseEvent) => void;
}) {
  const photoEl = (
    <div
      className="h-[72px] w-[72px] rounded-full bg-cover bg-center ring-2 ring-white/25"
      style={profileAvatarStyle(avatarUrl)}
      aria-hidden
    >
      {!avatarUrl?.trim() && (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-pink/80 to-brand-purple text-xl font-bold text-white">
          {initials}
        </span>
      )}
    </div>
  );

  return (
    <article
      className="membership-card relative aspect-[1.72/1] w-full overflow-hidden rounded-[24px]"
      style={{
        background:
          "linear-gradient(135deg, #1a0430 0%, #5a1880 60%, #28074a 100%)",
        boxShadow:
          "0 12px 40px rgba(90,24,128,0.5), 0 2px 8px rgba(0,0,0,0.35)",
      }}
      aria-label="Zľavová karta ONKO KLUBU"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-brand-pink/20 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-white/5 blur-2xl"
      />

      <div className="relative flex h-full flex-col px-5 pb-4 pt-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <Image
            src="/logo/onkoklub-horizontal.png"
            alt="ONKO KLUB"
            width={1642}
            height={538}
            className="h-[18px] w-auto brightness-0 invert opacity-85"
          />
          <Image
            src="/logo/nie-rakovine.png"
            alt="NIE RAKOVINE, o.z."
            width={1626}
            height={851}
            className="h-[14px] w-auto brightness-0 invert opacity-40"
          />
        </div>

        {/* Content row */}
        <div className="mt-3 flex flex-1 items-center gap-3">
          {/* Avatar */}
          {onPhotoClick ? (
            <button
              type="button"
              onClick={onPhotoClick}
              className="group relative shrink-0 rounded-full"
              aria-label="Zmeniť profilovú fotografiu"
            >
              {photoEl}
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition group-hover:opacity-100">
                <span className="rounded-pill bg-black/60 px-2 py-0.5 text-[8px] font-semibold text-white">
                  Upraviť
                </span>
              </span>
            </button>
          ) : (
            <div className="shrink-0">{photoEl}</div>
          )}

          {/* Name + status */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[17px] font-bold leading-tight text-white">
              {fullName}
            </h2>
            <div
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[10px] font-semibold ${
                subscription.active
                  ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/25"
                  : "bg-white/10 text-white/50 ring-1 ring-white/10"
              }`}
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${
                  subscription.active ? "bg-emerald-400" : "bg-white/30"
                }`}
              />
              {subscription.active ? "Aktívny člen" : "Neaktívny člen"}
            </div>
          </div>

          {/* QR code */}
          <div className="shrink-0 overflow-hidden rounded-xl bg-white p-[5px] shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
            <QRCodeSVG
              value={memberNumberRaw}
              size={qrSize}
              fgColor="#28074a"
              bgColor="#ffffff"
              level="M"
            />
          </div>
        </div>

        {/* Footer — member number */}
        <div className="mt-2 border-t border-white/10 pt-2">
          <p className="membership-card-id font-mono text-[10px] tracking-widest text-white/35">
            {memberNumber}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ── Zoom modal — scan-focused view ── */

function ZoomModal({
  fullName,
  initials,
  avatarUrl,
  subscription,
  memberNumber,
  memberNumberRaw,
  onClose,
}: {
  fullName: string;
  initials: string;
  avatarUrl?: string | null;
  subscription: MembershipSubscriptionInfo;
  memberNumber: string;
  memberNumberRaw: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="mx-6 w-full max-w-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scan card */}
        <div
          className="flex flex-col items-center gap-5 overflow-hidden rounded-3xl p-6"
          style={{
            background:
              "linear-gradient(150deg, #1a0430 0%, #5a1880 65%, #28074a 100%)",
            boxShadow: "0 20px 60px rgba(90,24,128,0.6), 0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          {/* Avatar + name */}
          <div className="flex items-center gap-3 self-stretch">
            <div
              className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center ring-2 ring-white/25"
              style={profileAvatarStyle(avatarUrl)}
              aria-hidden
            >
              {!avatarUrl?.trim() && (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-pink/80 to-brand-purple text-base font-bold text-white">
                  {initials}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-white">{fullName}</p>
              <p className="text-[10px] text-white/50">ONKO KLUB</p>
            </div>
          </div>

          {/* Big QR */}
          <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <QRCodeSVG
              value={memberNumberRaw}
              size={200}
              fgColor="#1a0430"
              bgColor="#ffffff"
              level="M"
            />
          </div>

          {/* Status + member number */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
                subscription.active
                  ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/25"
                  : "bg-white/10 text-white/50 ring-1 ring-white/10"
              }`}
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${
                  subscription.active ? "bg-emerald-400" : "bg-white/30"
                }`}
              />
              {subscription.active ? "Aktívne predplatné" : "Neaktívne predplatné"}
            </div>
            <p className="font-mono text-[11px] tracking-widest text-white/35">
              {memberNumber}
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-white/40">
          Klepnite mimo kartu pre zatvorenie
        </p>
      </div>
    </div>
  );
}
