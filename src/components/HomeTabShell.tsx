"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FeedHeader } from "@/components/FeedHeader";
import { FeedTabPanel } from "@/components/tabs/FeedTabPanel";
import { ForumsTabPanel } from "@/components/tabs/ForumsTabPanel";
import { SearchTabPanel } from "@/components/tabs/SearchTabPanel";
import { CalendarTabPanel } from "@/components/tabs/CalendarTabPanel";

type Tab = "home" | "forums" | "search" | "calendar";

const MAIN_TAB_PATHS: Record<string, Tab> = {
  "/home": "home",
  "/home/forums": "forums",
  "/home/search": "search",
  "/home/calendar": "calendar",
};

function pathnameToTab(p: string): Tab | null {
  return MAIN_TAB_PATHS[p] ?? null;
}

export function HomeTabShell({
  children,
  userName,
  unreadCount,
}: {
  children: React.ReactNode;
  userName: string;
  unreadCount: number;
}) {
  const pathname = usePathname();
  const tab = pathnameToTab(pathname);
  const isMainTab = tab !== null;

  const [activeTab, setActiveTab] = useState<Tab>(tab ?? "home");

  // Track which tabs have ever been activated (keep them in the DOM once mounted)
  const [mountedTabs, setMountedTabs] = useState<Set<Tab>>(
    () => new Set([tab ?? "home"]),
  );

  // Sync when pathname changes (Link navigation or browser back/forward)
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
      setMountedTabs((s) => new Set([...s, tab]));
    }
  }, [tab]);

  // Reset scroll to top when switching between main tabs
  useEffect(() => {
    if (!isMainTab) return;
    const el = document.querySelector("[data-app-scroll]");
    if (el) el.scrollTop = 0;
  }, [activeTab, isMainTab]);

  // Visibility helper: panel is visible when on a main tab AND it's the active one
  const visible = (t: Tab) => isMainTab && activeTab === t;

  return (
    <>
      {/* ── Shared header — only while on a main tab ── */}
      {isMainTab && <FeedHeader name={userName} unreadCount={unreadCount} />}

      {/*
       * Tab panels live outside the isMainTab guard so they stay mounted
       * when the user navigates to subpages. CSS hides them; their state
       * (fetched data, scroll position) is preserved for instant return.
       */}
      {mountedTabs.has("home") && (
        <div className={visible("home") ? "" : "hidden"} aria-hidden={!visible("home")}>
          <FeedTabPanel />
        </div>
      )}
      {mountedTabs.has("forums") && (
        <div className={visible("forums") ? "" : "hidden"} aria-hidden={!visible("forums")}>
          <ForumsTabPanel />
        </div>
      )}
      {mountedTabs.has("search") && (
        <div className={visible("search") ? "" : "hidden"} aria-hidden={!visible("search")}>
          <SearchTabPanel />
        </div>
      )}
      {mountedTabs.has("calendar") && (
        <div className={visible("calendar") ? "" : "hidden"} aria-hidden={!visible("calendar")}>
          <CalendarTabPanel />
        </div>
      )}

      {/* ── Subpage content — forums threads, post detail, profile, etc. ── */}
      {!isMainTab && children}
    </>
  );
}
