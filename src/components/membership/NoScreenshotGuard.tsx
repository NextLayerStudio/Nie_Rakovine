"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Best-effort deterrent for screenshots and copying on sensitive membership cards.
 * Note: browsers cannot fully block OS-level screenshots.
 */
export function NoScreenshotGuard({
  children,
  className,
  fullPage = false,
}: {
  children: ReactNode;
  className?: string;
  fullPage?: boolean;
}) {
  useEffect(() => {
    const blockEvent = (event: Event) => {
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const meta = event.metaKey || event.ctrlKey;

      if (key === "printscreen") {
        event.preventDefault();
        void navigator.clipboard?.writeText("").catch(() => undefined);
        return;
      }

      if (meta && event.shiftKey && ["3", "4", "5", "s"].includes(key)) {
        event.preventDefault();
      }

      if (meta && !event.shiftKey && key === "s" && event.altKey) {
        event.preventDefault();
      }
    };

    const onVisibility = () => {
      if (document.hidden && document.fullscreenElement) {
        void document.exitFullscreen?.().catch(() => undefined);
      }
    };

    document.addEventListener("contextmenu", blockEvent);
    document.addEventListener("copy", blockEvent);
    document.addEventListener("cut", blockEvent);
    document.addEventListener("dragstart", blockEvent);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibility);

    if (fullPage) {
      document.body.classList.add("membership-no-screenshot");
    }

    return () => {
      document.removeEventListener("contextmenu", blockEvent);
      document.removeEventListener("copy", blockEvent);
      document.removeEventListener("cut", blockEvent);
      document.removeEventListener("dragstart", blockEvent);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
      if (fullPage) {
        document.body.classList.remove("membership-no-screenshot");
      }
    };
  }, [fullPage]);

  return (
    <div
      className={cn(
        "membership-protected select-none [-webkit-touch-callout:none]",
        className,
      )}
      onContextMenu={(event) => event.preventDefault()}
      draggable={false}
    >
      {children}
    </div>
  );
}
