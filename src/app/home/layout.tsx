import { Suspense } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HomeTabShell } from "@/components/HomeTabShell";
import { MenuDrawer } from "@/components/MenuDrawer";
import { NotificationsDrawer } from "@/components/NotificationsDrawer";
import { HomeAvatarPrompt } from "@/components/profile/HomeAvatarPrompt";
import { PhoneShell } from "@/components/PhoneShell";
import { requireUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const unreadCount = await getUnreadNotificationCount(user.id);

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
