"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toggleProfileFollowAction } from "@/lib/actions/follows";

export function FollowProfileButton({
  profileId,
  handle,
  isFollowing: initialFollowing,
  fullWidth = false,
}: {
  profileId: string;
  handle: string;
  isFollowing: boolean;
  fullWidth?: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [showConfirm, setShowConfirm] = useState(false);
  const [, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // Already following → show nothing (unless fullWidth, then show disabled state)
  if (following && !showConfirm) {
    if (!fullWidth) return null;
    return (
      <div className="w-full rounded-xl border border-brand-purple/20 py-1.5 text-center text-sm font-semibold text-brand-purple/40">
        Sledované
      </div>
    );
  }

  if (showConfirm) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-purple/60">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Sledované
      </span>
    );
  }

  const handleFollow = () => {
    setFollowing(true);
    setShowConfirm(true);
    timerRef.current = setTimeout(() => setShowConfirm(false), 1400);
    const fd = new FormData();
    fd.set("profileId", profileId);
    fd.set("handle", handle);
    startTransition(() => { void toggleProfileFollowAction(fd); });
  };

  return (
    <button
      type="button"
      onClick={handleFollow}
      className={`rounded-xl border border-brand-pink text-sm font-semibold text-brand-pink transition hover:bg-brand-pink/5 active:scale-95 ${
        fullWidth ? "w-full py-1.5" : "px-3.5 py-1"
      }`}
    >
      Sledovať
    </button>
  );
}
