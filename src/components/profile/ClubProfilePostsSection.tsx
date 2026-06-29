"use client";

import { useMemo, useState } from "react";
import type { PostType } from "@prisma/client";
import {
  ProfilePostGrid,
  type ProfileGridPost,
} from "@/components/profile/ProfilePostGrid";

type FilterTab = "all" | "VIDEO" | "AUDIO" | "ARTICLE";

const TABS: { id: FilterTab; label: string; Icon: React.FC<{ active: boolean }> }[] = [
  { id: "all",     label: "Všetko",       Icon: AllIcon },
  { id: "VIDEO",   label: "Video",        Icon: VideoIcon },
  { id: "AUDIO",   label: "Audio",        Icon: AudioIcon },
  { id: "ARTICLE", label: "Text / Článok", Icon: ArticleIcon },
];

export function ClubProfilePostsSection({ posts }: { posts: ProfileGridPost[] }) {
  const [active, setActive] = useState<FilterTab>("all");

  const filtered = useMemo(
    () =>
      active === "all"
        ? posts
        : posts.filter((p) => p.type === (active as PostType)),
    [active, posts],
  );

  const emptyMessages: Record<FilterTab, string> = {
    all:     "Zatiaľ žiadne príspevky.",
    VIDEO:   "Žiadne videá.",
    AUDIO:   "Žiadny audio obsah.",
    ARTICLE: "Žiadne články.",
  };

  return (
    <>
      {/* Instagram-style filter bar */}
      <div className="border-y border-brand-purple/10">
        <nav
          aria-label="Filtrovať príspevky"
          className="flex items-stretch"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                type="button"
                aria-label={tab.label}
                aria-pressed={isActive}
                onClick={() => {
                  setActive(tab.id);
                  document
                    .querySelector("[data-app-scroll]")
                    ?.scrollTo({ top: 0, behavior: "instant" });
                }}
                className={`relative flex flex-1 items-center justify-center py-3 transition-colors ${
                  isActive ? "text-brand-pink" : "text-brand-purple/35 hover:text-brand-purple/60"
                }`}
              >
                <tab.Icon active={isActive} />
                {/* Instagram-style active indicator — thin line at bottom */}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-brand-pink" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <ProfilePostGrid
        posts={filtered}
        emptyMessage={emptyMessages[active]}
      />
    </>
  );
}

/* ── Icons ────────────────────────────────────────────────────────── */

function AllIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.7}
      aria-hidden
    >
      <rect x="3"  y="3"  width="7" height="7" rx="1" />
      <rect x="14" y="3"  width="7" height="7" rx="1" />
      <rect x="3"  y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function VideoIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      {/* Film strip rectangle */}
      <rect x="2" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.12 : 0} />
      {/* Play triangle */}
      <path
        d={active ? "M8 9.5l5 2.5-5 2.5V9.5z" : "M8 9.5l5 2.5-5 2.5V9.5z"}
        fill="currentColor"
        stroke="none"
      />
      {/* Camera side */}
      <path d="M16 9l6-3v12l-6-3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function AudioIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      {/* Headphones */}
      <path
        d="M3 14v-2a9 9 0 0118 0v2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <rect
        x="2"
        y="14"
        width="4"
        height="5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.2 : 0}
      />
      <rect
        x="18"
        y="14"
        width="4"
        height="5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.2 : 0}
      />
    </svg>
  );
}

function ArticleIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <rect
        x="4" y="3" width="16" height="18" rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.1 : 0}
      />
      <path
        d="M8 8h8M8 12h8M8 16h5"
        stroke={active ? "currentColor" : "currentColor"}
        strokeWidth={active ? 2 : 1.7}
        strokeLinecap="round"
        opacity={active ? 1 : 0.9}
      />
    </svg>
  );
}
