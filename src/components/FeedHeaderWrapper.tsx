import { requireUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { FeedHeader } from "@/components/FeedHeader";

export async function FeedHeaderWrapper() {
  const user = await requireUser();
  const unreadCount = await getUnreadNotificationCount(user.id);
  return <FeedHeader name={user.fullName} unreadCount={unreadCount} />;
}
