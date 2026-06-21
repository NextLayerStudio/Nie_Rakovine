"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PROFILE_SLOGANS } from "@/lib/profile-page";

export function ProfileHeader({
  unreadCount = 0,
}: {
  unreadCount?: number;
}) {
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSloganIndex((i) => (i + 1) % PROFILE_SLOGANS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white px-4 pb-2 pt-3">
      <div className="flex items-center gap-2">
        <Link
          href="/home"
          aria-label="Späť"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-brand-purple"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <div className="min-w-0 flex-1 px-1 text-center">
          <p className="line-clamp-2 text-[11px] font-medium leading-snug text-brand-purple/75 transition-opacity duration-500">
            {PROFILE_SLOGANS[sloganIndex]}
          </p>
          <div className="mt-1.5 flex justify-center gap-1">
            {PROFILE_SLOGANS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 w-1 rounded-full transition",
                  i === sloganIndex ? "bg-brand-pink" : "bg-brand-purple/20",
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            aria-label="Notifikácie"
            onClick={() =>
              document.dispatchEvent(new CustomEvent("open-notifications"))
            }
            className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-pink-soft text-brand-purple"
          >
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
            <BellIcon />
          </button>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => document.dispatchEvent(new CustomEvent("open-menu"))}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand-pink-soft text-brand-purple"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5L6 16zM10 20a2 2 0 004 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
