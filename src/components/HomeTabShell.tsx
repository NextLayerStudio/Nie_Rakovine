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

  // Which tab is currently showing (drives CSS show/hide)
  const [activeTab, setActiveTab] = useState<Tab>(tab ?? "home");

  // Track which tabs have been mounted at least once (don't unmount them)
  const [mountedTabs, setMountedTabs] = useState<Set<Tab>>(
    () => new Set([tab ?? "home"]),
  );

  // Sync active tab when URL changes (e.g., BottomNav Link click or browser back)
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
      setMountedTabs((s) => new Set([...s, tab]));
    }
  }, [tab]);

  // Reset scroll to top on tab switch
  useEffect(() => {
    const el = document.querySelector("[data-app-scroll]");
    if (el) el.scrollTop = 0;
  }, [activeTab]);

  return (
    <>
      {/* ── Main tab area ── */}
      {isMainTab && (
        <>
          {/* Single shared header across all tabs */}
          <FeedHeader name={userName} unreadCount={unreadCount} />

          {/* Each tab stays in DOM once visited — CSS hides inactive ones */}
          {mountedTabs.has("home") && (
            <div className={activeTab === "home" ? "" : "hidden"} aria-hidden={activeTab !== "home"}>
              <FeedTabPanel />
            </div>
          )}
          {mountedTabs.has("forums") && (
            <div className={activeTab === "forums" ? "" : "hidden"} aria-hidden={activeTab !== "forums"}>
              <ForumsTabPanel />
            </div>
          )}
          {mountedTabs.has("search") && (
            <div className={activeTab === "search" ? "" : "hidden"} aria-hidden={activeTab !== "search"}>
              <SearchTabPanel />
            </div>
          )}
          {mountedTabs.has("calendar") && (
            <div className={activeTab === "calendar" ? "" : "hidden"} aria-hidden={activeTab !== "calendar"}>
              <CalendarTabPanel />
            </div>
          )}
        </>
      )}

      {/* ── Subpages (post detail, profile, forum thread, etc.) ── */}
      {!isMainTab && children}
    </>
  );
}
