"use client";

import { formatEventPrice } from "@/lib/event-payment";

export function EventPriceBadge({
  priceCents,
  currency = "EUR",
  className = "",
}: {
  priceCents: number;
  currency?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-amber-400/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950 ${className}`}
    >
      {formatEventPrice(priceCents, currency)}
    </span>
  );
}

export function EventPaidLabel({
  priceCents,
  currency = "EUR",
  compact = false,
}: {
  priceCents: number;
  currency?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold text-amber-100 ${
        compact ? "text-[11px]" : "text-xs"
      }`}
    >
      <CoinIcon />
      Platené · {formatEventPrice(priceCents, currency)}
    </span>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 5v6M6 8h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
