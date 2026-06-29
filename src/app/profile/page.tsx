import { Suspense } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MenuDrawer } from "@/components/MenuDrawer";
import { NotificationsDrawer } from "@/components/NotificationsDrawer";
import { PhoneShell } from "@/components/PhoneShell";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileIdentityCard } from "@/components/profile/ProfileIdentityCard";
import { ProfileTabBar } from "@/components/profile/ProfileTabBar";
import { ProfileView } from "@/components/profile/ProfileView";
import { requireUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { parseProfileTab } from "@/lib/profile-page";
import { membershipSubscriptionInfo } from "@/lib/membership-card";

export const dynamic = "force-dynamic";

function TabSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-purple/15 border-t-brand-pink" />
    </div>
  );
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; setupAvatar?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const initialTab = parseProfileTab(params.tab);
  const forceAvatarPrompt = params.setupAvatar === "1";

  const unreadCount = await getUnreadNotificationCount(user.id);

  const nameParts = user.fullName.trim().split(/\s+/).filter(Boolean);

  return (
    <PhoneShell>
      <div
        data-profile-scroll
        className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(5.5rem+env(safe-area-inset-bottom))]"
      >
        {/* These render immediately — no JS wait */}
        <ProfileHeader unreadCount={unreadCount} />
        <ProfileIdentityCard
          fullName={user.fullName}
          userId={user.id}
          profile={
            user.profile
              ? {
                  diagnosis: user.profile.diagnosis,
                  diagnosisPhase: user.profile.diagnosisPhase,
                  cancerTypes: user.profile.cancerTypes,
                }
              : null
          }
          subscription={membershipSubscriptionInfo(user)}
          avatarUrl={user.profile?.avatarUrl ?? null}
          forceAvatarPrompt={forceAvatarPrompt}
        />
        <ProfileTabBar initialTab={initialTab} />

        {/* Tab content — needs useSearchParams, wrapped in Suspense */}
        <Suspense fallback={<TabSpinner />}>
          <ProfileView initialTab={initialTab} />
        </Suspense>
      </div>
      <BottomNav />
      <MenuDrawer
        userName={user.fullName}
        avatarUrl={user.profile?.avatarUrl ?? null}
        isAdmin={user.role === "ADMIN"}
      />
      <NotificationsDrawer />
    </PhoneShell>
  );
}
