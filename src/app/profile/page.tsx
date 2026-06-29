import { Suspense } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MenuDrawer } from "@/components/MenuDrawer";
import { NotificationsDrawer } from "@/components/NotificationsDrawer";
import { PhoneShell } from "@/components/PhoneShell";
import { ProfileView } from "@/components/profile/ProfileView";
import { requireUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { parseProfileTab } from "@/lib/profile-page";
import { membershipSubscriptionInfo } from "@/lib/membership-card";

export const dynamic = "force-dynamic";

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
      <div data-profile-scroll className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <Suspense fallback={null}>
          <ProfileView
            data={{
              fullName: user.fullName,
              userId: user.id,
              defaultName: nameParts[0] ?? "",
              defaultSurname: nameParts.slice(1).join(" "),
              profile: user.profile
                ? {
                    diagnosis: user.profile.diagnosis,
                    diagnosisPhase: user.profile.diagnosisPhase,
                    cancerTypes: user.profile.cancerTypes,
                  }
                : null,
              unreadCount,
              subscription: membershipSubscriptionInfo(user),
              avatarUrl: user.profile?.avatarUrl ?? null,
            }}
            initialTab={initialTab}
            forceAvatarPrompt={forceAvatarPrompt}
          />
        </Suspense>
      </div>
      <BottomNav />
      <MenuDrawer userName={user.fullName} avatarUrl={user.profile?.avatarUrl ?? null} isAdmin={user.role === "ADMIN"} />
      <NotificationsDrawer />
    </PhoneShell>
  );
}
