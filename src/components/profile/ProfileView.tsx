"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { parseProfileTab, type ProfileTab } from "@/lib/profile-page";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import {
  ProfileIdentityCard,
} from "@/components/profile/ProfileIdentityCard";
import type { MembershipSubscriptionInfo } from "@/lib/membership-card";
import { ProfileTabBar } from "@/components/profile/ProfileTabBar";
import {
  ProfileCalendarTab,
  type ProfileRegisteredEvent,
} from "@/components/profile/ProfileCalendarTab";
import {
  ProfileForumsTab,
  type ProfileForumChip,
  type ProfileForumConversation,
} from "@/components/profile/ProfileForumsTab";
import {
  ProfileDiscountsTab,
  type ProfileFeaturedBrand,
  type ProfileSavedDiscount,
} from "@/components/profile/ProfileDiscountsTab";
import {
  ProfileSavedTab,
  type ProfileSavedPost,
} from "@/components/profile/ProfileSavedTab";

export type ProfileViewData = {
  fullName: string;
  userId: string;
  defaultName: string;
  defaultSurname: string;
  profile: {
    diagnosis: string | null;
    diagnosisPhase: string | null;
    cancerTypes: string[];
  } | null;
  unreadCount: number;
  subscription: MembershipSubscriptionInfo;
  avatarUrl: string | null;
  registeredEvents: ProfileRegisteredEvent[];
  forums: ProfileForumChip[];
  forumConversations: ProfileForumConversation[];
  featuredBrands: ProfileFeaturedBrand[];
  savedDiscounts: ProfileSavedDiscount[];
  savedPosts: ProfileSavedPost[];
};

export function ProfileView({
  data,
  initialTab,
  forceAvatarPrompt = false,
}: {
  data: ProfileViewData;
  initialTab: ProfileTab;
  forceAvatarPrompt?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = parseProfileTab(searchParams.get("tab") ?? initialTab);

  const setTab = useCallback(
    (tab: ProfileTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "calendar") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      const qs = params.toString();
      router.replace(qs ? `/profile?${qs}` : "/profile", { scroll: false });
      // Reset scroll to top on tab switch so new tab content starts at top
      document
        .querySelector("[data-profile-scroll]")
        ?.scrollTo({ top: 0, behavior: "instant" });
    },
    [router, searchParams],
  );

  return (
    <>
      <ProfileHeader unreadCount={data.unreadCount} />
      <ProfileIdentityCard
        fullName={data.fullName}
        userId={data.userId}
        profile={data.profile}
        subscription={data.subscription}
        avatarUrl={data.avatarUrl}
        forceAvatarPrompt={forceAvatarPrompt}
      />
      <ProfileTabBar active={activeTab} onChange={setTab} />

      {activeTab === "calendar" && (
        <ProfileCalendarTab
          events={data.registeredEvents}
          defaultName={data.defaultName}
          defaultSurname={data.defaultSurname}
        />
      )}
      {activeTab === "forums" && (
        <ProfileForumsTab
          forums={data.forums}
          conversations={data.forumConversations}
        />
      )}
      {activeTab === "discounts" && (
        <ProfileDiscountsTab
          savedDiscounts={data.savedDiscounts}
          featuredBrands={data.featuredBrands}
        />
      )}
      {activeTab === "saved" && <ProfileSavedTab posts={data.savedPosts} />}
    </>
  );
}
