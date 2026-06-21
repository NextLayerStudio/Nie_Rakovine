"use client";

import { cn } from "@/lib/utils";
import type { ProfileTab } from "@/lib/profile-page";

const TABS: { id: ProfileTab; label: string; icon: React.FC<{ active: boolean }> }[] = [
  { id: "calendar", label: "Kalendár", icon: CalendarTabIcon },
  { id: "forums", label: "Fóra", icon: ForumsTabIcon },
  { id: "discounts", label: "Zľavy", icon: DiscountsTabIcon },
  { id: "saved", label: "Uložené", icon: SavedTabIcon },
];

export function ProfileTabBar({
  active,
  onChange,
}: {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}) {
  return (
    <nav
      aria-label="Sekcie profilu"
      className="mx-4 mt-4 flex items-center justify-between rounded-2xl bg-white px-2 py-2 shadow-card"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(tab.id)}
            className={cn(
              "grid h-11 w-11 place-items-center rounded-xl transition",
              isActive ? "bg-brand-purple/10 text-brand-purple" : "text-brand-purple/45",
            )}
          >
            <Icon active={isActive} />
          </button>
        );
      })}
    </nav>
  );
}

function CalendarTabIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={active ? "h-7 w-7" : "h-6 w-6"} fill="none" aria-hidden>
      <rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 9.5h16M8 4v2.5M16 4v2.5" stroke="currentColor" strokeWidth="1.8" />
      {active && (
        <path d="M8.5 12.5h2v2h-2zM13.5 12.5h2v2h-2z" fill="currentColor" />
      )}
    </svg>
  );
}

function ForumsTabIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={active ? "h-7 w-7" : "h-6 w-6"} fill="none" aria-hidden>
      <path
        d="M6 9.5a5.5 5.5 0 0110.4-1.8A4.5 4.5 0 0119 12c0 2.4-2 4.3-4.5 4.3H12l-3.8 2.8V16.5A5.5 5.5 0 016 9.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="11.5" r="0.9" fill="currentColor" />
      <circle cx="12" cy="11.5" r="0.9" fill="currentColor" />
      <circle cx="15" cy="11.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function DiscountsTabIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={active ? "h-7 w-7" : "h-6 w-6"} fill="none" aria-hidden>
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SavedTabIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={active ? "h-7 w-7" : "h-6 w-6"} aria-hidden>
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
