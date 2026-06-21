"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { notificationTypeLabel } from "@/lib/notifications-client";
import {
  fetchNotificationsAction,
  markAllNotificationsReadAction,
  openNotificationAction,
} from "@/lib/actions/notifications";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  href: string | null;
  read: boolean;
  createdAt: string;
};

export function NotificationsDrawer() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [markPending, startMarkTransition] = useTransition();
  const router = useRouter();

  const fetchNotifications = async () => {
    setLoading(true);
    const result = await fetchNotificationsAction();
    if (result.ok) setNotifications(result.notifications as Notification[]);
    setLoading(false);
  };

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      fetchNotifications();
    };
    document.addEventListener("open-notifications", handler);
    return () => document.removeEventListener("open-notifications", handler);
  }, []);

  const close = () => setOpen(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAll = () => {
    startMarkTransition(async () => {
      await markAllNotificationsReadAction();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  };

  const handleOpen = async (n: Notification) => {
    if (!n.href) return;
    await openNotificationAction(
      (() => {
        const fd = new FormData();
        fd.set("id", n.id);
        fd.set("href", n.href);
        return fd;
      })(),
    );
    close();
    router.refresh();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 z-30 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={close}
        aria-hidden
      />

      {/* Drawer — vysúva sa zhora */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 z-40 flex max-h-[88%] flex-col bg-white",
          "transform transition-transform duration-300 ease-in-out",
          "rounded-b-3xl shadow-card",
          open ? "translate-y-0" : "-translate-y-full",
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-6 pb-3 border-b border-brand-purple/10">
          <h2 className="text-lg font-bold text-brand-purple">Oznámenia</h2>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                disabled={markPending}
                onClick={handleMarkAll}
                className="text-xs font-semibold text-brand-pink disabled:opacity-60"
              >
                {markPending ? "…" : "Označiť všetko"}
              </button>
            )}
            <button
              onClick={close}
              aria-label="Zatvoriť"
              className="grid h-8 w-8 place-items-center rounded-full bg-brand-purple/10 text-brand-purple"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {loading && (
            <div className="space-y-2 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-brand-purple/5 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <p className="py-8 text-center text-sm text-brand-purple/60">
              Žiadne oznámenia.
            </p>
          )}

          {!loading && notifications.map((n) => {
            const time = new Intl.DateTimeFormat("sk-SK", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(n.createdAt));

            const inner = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-pill bg-brand-purple/10 px-2 py-0.5 text-[10px] font-semibold text-brand-purple">
                    {notificationTypeLabel(n.type)}
                  </span>
                  <span className="shrink-0 text-[10px] text-brand-purple/50">{time}</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-brand-purple">{n.title}</p>
                {n.body && (
                  <p className="mt-0.5 text-xs leading-relaxed text-brand-purple/70">{n.body}</p>
                )}
              </>
            );

            const cls = cn(
              "w-full rounded-2xl p-3.5 text-left transition",
              n.read
                ? "bg-brand-purple/5"
                : "bg-white ring-2 ring-brand-pink/30 shadow-sm",
            );

            if (n.href) {
              return (
                <button key={n.id} type="button" className={cls} onClick={() => handleOpen(n)}>
                  {inner}
                </button>
              );
            }
            return <div key={n.id} className={cls}>{inner}</div>;
          })}
        </div>

        {/* Pull handle */}
        <div className="shrink-0 flex justify-center py-2">
          <div className="h-1 w-10 rounded-full bg-brand-purple/20" />
        </div>
      </div>
    </>
  );
}
