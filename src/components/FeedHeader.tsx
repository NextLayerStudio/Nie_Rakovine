"use client";

import Link from "next/link";
import { profileAvatarStyle } from "@/lib/avatar-style";

export function FeedHeader({
  name: _name,
  avatarUrl,
  unreadCount = 0,
}: {
  name: string;
  avatarUrl?: string | null;
  unreadCount?: number;
}) {
  return (
    <header className="sticky top-0 z-10 px-4 pb-1 pt-3">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Notifikácie"
          onClick={() => document.dispatchEvent(new CustomEvent("open-notifications"))}
          className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-pink text-white shadow-sm"
        >
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5L6 16zM10 20a2 2 0 004 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Menu"
          onClick={() => document.dispatchEvent(new CustomEvent("open-menu"))}
          className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center ring-2 ring-brand-purple/15 shadow-sm"
          style={profileAvatarStyle(avatarUrl)}
        />
      </div>
    </header>
  );
}

export function FeedTabs({
  active = "videos",
}: {
  active?: "videos" | "articles" | "recipes";
}) {
  const tabs = [
    { id: "videos" as const, label: "Videá", href: "/home" },
    { id: "articles" as const, label: "Články", href: "/home/articles" },
    { id: "recipes" as const, label: "Recepty", href: "/home/recipes" },
  ];
  return (
    <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto px-5 pb-3">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`pill-tab whitespace-nowrap transition ${
              isActive
                ? "bg-brand-purple text-white"
                : "bg-brand-pink-soft/60 text-brand-purple"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
