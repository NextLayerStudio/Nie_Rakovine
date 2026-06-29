"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import { parseProfileTab, type ProfileTab } from "@/lib/profile-page";
import { ProfileCalendarTab } from "@/components/profile/ProfileCalendarTab";
import { ProfileForumsTab } from "@/components/profile/ProfileForumsTab";
import { ProfileDiscountsTab } from "@/components/profile/ProfileDiscountsTab";
import { ProfileSavedTab } from "@/components/profile/ProfileSavedTab";
import {
  fetchProfileCalendarAction,
  fetchProfileForumsAction,
  fetchProfileDiscountsAction,
  fetchProfileSavedAction,
} from "@/lib/actions/profile-tabs";

type CalendarData = Extract<Awaited<ReturnType<typeof fetchProfileCalendarAction>>, { ok: true }>;
type ForumsData = Extract<Awaited<ReturnType<typeof fetchProfileForumsAction>>, { ok: true }>;
type DiscountsData = Extract<Awaited<ReturnType<typeof fetchProfileDiscountsAction>>, { ok: true }>;
type SavedData = Extract<Awaited<ReturnType<typeof fetchProfileSavedAction>>, { ok: true }>;

function TabSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-purple/15 border-t-brand-pink" />
    </div>
  );
}

export function ProfileView({
  initialTab,
  initialCalendarData,
  basePath: _basePath = "/profile",
}: {
  initialTab: ProfileTab;
  initialCalendarData?: CalendarData;
  basePath?: string;
}) {
  const searchParams = useSearchParams();
  const activeTab = parseProfileTab(searchParams.get("tab") ?? initialTab);

  const [calendarData, setCalendarData] = useState<CalendarData | null>(initialCalendarData ?? null);
  const [forumsData, setForumsData] = useState<ForumsData | null>(null);
  const [discountsData, setDiscountsData] = useState<DiscountsData | null>(null);
  const [savedData, setSavedData] = useState<SavedData | null>(null);
  const [loadingTab, setLoadingTab] = useState<ProfileTab | null>(null);

  // Calendar is pre-fetched server-side — mark it so we never re-fetch
  const fetched = useRef(new Set<ProfileTab>(initialCalendarData ? ["calendar"] : []));

  const loadTab = useCallback(async (tab: ProfileTab) => {
    if (fetched.current.has(tab)) return;
    fetched.current.add(tab);
    setLoadingTab(tab);
    try {
      switch (tab) {
        case "calendar": {
          const res = await fetchProfileCalendarAction();
          if (res.ok) setCalendarData(res);
          break;
        }
        case "forums": {
          const res = await fetchProfileForumsAction();
          if (res.ok) setForumsData(res);
          break;
        }
        case "discounts": {
          const res = await fetchProfileDiscountsAction();
          if (res.ok) setDiscountsData(res);
          break;
        }
        case "saved": {
          const res = await fetchProfileSavedAction();
          if (res.ok) setSavedData(res);
          break;
        }
      }
    } finally {
      setLoadingTab((cur) => (cur === tab ? null : cur));
    }
  }, []);

  // Load initial tab on mount
  useEffect(() => {
    loadTab(initialTab);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the tab bar navigates (URL changes), load that tab's data
  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab, loadTab]);

  const isLoading = loadingTab === activeTab;

  return (
    <>
      {isLoading && <TabSpinner />}

      {!isLoading && activeTab === "calendar" && calendarData && (
        <ProfileCalendarTab
          events={calendarData.registeredEvents}
          defaultName={calendarData.defaultName}
          defaultSurname={calendarData.defaultSurname}
        />
      )}
      {!isLoading && activeTab === "forums" && forumsData && (
        <ProfileForumsTab forums={forumsData.forums} posts={forumsData.forumPosts} />
      )}
      {!isLoading && activeTab === "discounts" && discountsData && (
        <ProfileDiscountsTab
          savedDiscounts={discountsData.savedDiscounts}
          featuredBrands={discountsData.featuredBrands}
        />
      )}
      {!isLoading && activeTab === "saved" && savedData && (
        <ProfileSavedTab posts={savedData.savedPosts} />
      )}
    </>
  );
}
