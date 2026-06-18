"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import {
  markAllNotificationsReadAction,
  openNotificationAction,
} from "@/lib/actions/notifications";

export function MarkAllReadButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await markAllNotificationsReadAction();
          if (result.ok) {
            router.refresh();
          }
        });
      }}
      className="text-xs font-semibold text-brand-pink disabled:opacity-60"
    >
      {pending ? "…" : "Označiť všetko ako prečítané"}
    </button>
  );
}

export function NotificationOpenButton({
  id,
  href,
  className,
  children,
}: {
  id: string;
  href: string;
  className: string;
  children: ReactNode;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={() => {
        startTransition(async () => {
          await openNotificationAction(
            (() => {
              const formData = new FormData();
              formData.set("id", id);
              formData.set("href", href);
              return formData;
            })(),
          );
        });
      }}
    >
      {children}
    </button>
  );
}
