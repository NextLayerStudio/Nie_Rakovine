"use client";

import { Suspense } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileIdentityCard } from "@/components/profile/ProfileIdentityCard";
import { ProfileTabBar } from "@/components/profile/ProfileTabBar";
import { ProfileView } from "@/components/profile/ProfileView";
import type { MembershipSubscriptionInfo } from "@/lib/membership-card";
import type { fetchProfileCalendarAction } from "@/lib/actions/profile-tabs";

type CalendarData = Extract<Awaited<ReturnType<typeof fetchProfileCalendarAction>>, { ok: true }>;

export type ProfileInitialData = {
  fullName: string;
  userId: string;
  profile: {
    diagnosis: string | null;
    diagnosisPhase: string | null;
    cancerTypes: string[];
  } | null;
  subscription: MembershipSubscriptionInfo;
  avatarUrl: string | null;
  unreadCount: number;
  initialCalendarData: CalendarData;
};

function TabSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-purple/15 border-t-brand-pink" />
    </div>
  );
}

export function ProfileTabPanel({ data }: { data: ProfileInitialData }) {
  return (
    <>
      <ProfileHeader unreadCount={data.unreadCount} />
      <ProfileIdentityCard
        fullName={data.fullName}
        userId={data.userId}
        profile={data.profile}
        subscription={data.subscription}
        avatarUrl={data.avatarUrl}
      />
      <ProfileTabBar initialTab="calendar" basePath="/home/profile" />
      <Suspense fallback={<TabSpinner />}>
        <ProfileView
          initialTab="calendar"
          initialCalendarData={data.initialCalendarData}
          basePath="/home/profile"
        />
      </Suspense>
    </>
  );
}
