import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { notificationTypeLabel } from "@/lib/notifications";
import {
  markAllNotificationsReadAction,
  openNotificationAction,
} from "@/lib/actions/notifications";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requireUser();

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <FeedHeaderWrapper />

      <section className="px-5 pb-24">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-brand-purple">Notifikácie</h2>
          {unreadCount > 0 && (
            <form action={markAllNotificationsReadAction}>
              <button
                type="submit"
                className="text-xs font-semibold text-brand-pink"
              >
                Označiť všetko ako prečítané
              </button>
            </form>
          )}
        </div>

        <ul className="mt-4 space-y-3">
          {notifications.length === 0 && (
            <li className="card p-5 text-center text-xs text-brand-purple/70">
              Žiadne notifikácie. Sledujte profily (tlačidlo Sledovať) — pri novom
              príspevku dostanete upozornenie. Po schválení správy vo fóre tiež.
            </li>
          )}
          {notifications.map((n) => (
            <li key={n.id}>
              <NotificationItem notification={n} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function NotificationItem({
  notification: n,
}: {
  notification: {
    id: string;
    type: Parameters<typeof notificationTypeLabel>[0];
    title: string;
    body: string | null;
    href: string | null;
    read: boolean;
    createdAt: Date;
  };
}) {
  const time = new Intl.DateTimeFormat("sk-SK", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(n.createdAt);

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-pill bg-brand-purple/10 px-2 py-0.5 text-[10px] font-semibold text-brand-purple">
          {notificationTypeLabel(n.type)}
        </span>
        <span className="text-[10px] text-brand-purple/50">{time}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-brand-purple">{n.title}</p>
      {n.body && (
        <p className="mt-1 text-xs leading-relaxed text-brand-purple/75">
          {n.body}
        </p>
      )}
    </>
  );

  const className = `card w-full p-4 text-left transition ${
    n.read ? "opacity-80" : "ring-2 ring-brand-pink/30"
  }`;

  if (n.href) {
    return (
      <form action={openNotificationAction}>
        <input type="hidden" name="id" value={n.id} />
        <input type="hidden" name="href" value={n.href} />
        <button type="submit" className={className}>
          {content}
        </button>
      </form>
    );
  }

  return <div className={className}>{content}</div>;
}
