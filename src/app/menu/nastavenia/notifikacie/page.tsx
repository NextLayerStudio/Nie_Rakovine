import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { NotificationsForm } from "./NotificationsForm";

export const dynamic = "force-dynamic";

export default async function NotificationsSettingsPage() {
  const user = await requireUser();

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu/nastavenia" title="Notifikácie" />
        <NotificationsForm
          consentNewsletter={user.profile?.consentNewsletter ?? false}
          notifyRadiusKm={user.profile?.notifyRadiusKm ?? 50}
          notificationPrefs={{
            notifyNewPosts: user.profile?.notifyNewPosts ?? true,
            notifyForumApproved: user.profile?.notifyForumApproved ?? true,
            notifyForumReactions: user.profile?.notifyForumReactions ?? true,
            notifyEventsNearby: user.profile?.notifyEventsNearby ?? true,
          }}
        />
      </div>
    </PhoneShell>
  );
}
