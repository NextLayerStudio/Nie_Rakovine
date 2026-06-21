import { Suspense } from "react";
import type { CancerType } from "@prisma/client";
import { BottomNav } from "@/components/BottomNav";
import { HomeTabShell } from "@/components/HomeTabShell";
import { MenuDrawer } from "@/components/MenuDrawer";
import { NotificationsDrawer } from "@/components/NotificationsDrawer";
import { HomeAvatarPrompt } from "@/components/profile/HomeAvatarPrompt";
import { PhoneShell } from "@/components/PhoneShell";
import { requireUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { loadFeedTabData, loadForumsTabData, loadCalendarTabData } from "@/lib/tab-data";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const tabProfile = user.profile
    ? {
        cancerTypes: user.profile.cancerTypes as CancerType[],
        latitude: user.profile.latitude,
        longitude: user.profile.longitude,
        notifyRadiusKm: user.profile.notifyRadiusKm,
      }
    : null;

  const [unreadCount, feedData, forumsData, calendarData] = await Promise.all([
    getUnreadNotificationCount(user.id),
    loadFeedTabData(user.id, user.fullName, tabProfile),
    loadForumsTabData(user.id, tabProfile),
    loadCalendarTabData(user.id, user.fullName, tabProfile),
  ]);

  return (
    <PhoneShell>
      <div
        data-app-scroll
        className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain pb-[calc(5.5rem+env(safe-area-inset-bottom))]"
      >
        <HomeTabShell
          userName={user.fullName}
          avatarUrl={user.profile?.avatarUrl ?? null}
          unreadCount={unreadCount}
          initialFeedData={feedData}
          initialForumsData={forumsData}
          initialCalendarData={calendarData}
        >
          {children}
        </HomeTabShell>
      </div>
      <BottomNav />
      <MenuDrawer
        userName={user.fullName}
        avatarUrl={user.profile?.avatarUrl ?? null}
        isAdmin={user.role === "ADMIN"}
      />
      <NotificationsDrawer />
      <Suspense fallback={null}>
        <HomeAvatarPrompt
          fullName={user.fullName}
          avatarUrl={user.profile?.avatarUrl ?? null}
        />
      </Suspense>
    </PhoneShell>
  );
}
