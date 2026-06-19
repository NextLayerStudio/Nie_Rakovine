"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function FeedHeader({
  name,
  unreadCount = 0,
}: {
  name: string;
  unreadCount?: number;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector("[data-app-scroll]");
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-10 px-5 font-sans transition-all duration-300",
        scrolled ? "pb-2 pt-2" : "pb-1.5 pt-3",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Link href="/profile" className="flex min-w-0 flex-1 items-center gap-3">
          <div
            aria-hidden
            className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center ring-2 ring-brand-purple/15"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #b8c0c4 0%, #6f2380 100%)",
            }}
          />

          {/* Meno + Ahoj — animovaný collapse smerom do avatara */}
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              scrolled ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100",
            )}
          >
            <div
              className={cn(
                "overflow-hidden transition-transform duration-300 ease-in-out",
                scrolled ? "-translate-x-3" : "translate-x-0",
              )}
            >
              <p className="text-sm leading-none text-brand-pink">Ahoj!</p>
              <p className="mt-0.5 truncate text-xl font-bold leading-tight text-black">
                {name}
              </p>
            </div>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Notifikácie"
            onClick={() => document.dispatchEvent(new CustomEvent("open-notifications"))}
            className="relative grid h-11 w-11 place-items-center rounded-full bg-brand-pink-soft text-black"
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
            className="grid h-11 w-11 place-items-center rounded-full bg-brand-pink-soft text-black"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
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
