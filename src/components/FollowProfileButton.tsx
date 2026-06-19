"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toggleProfileFollowAction } from "@/lib/actions/follows";

export function FollowProfileButton({
  profileId,
  handle,
  isFollowing: initialFollowing,
}: {
  profileId: string;
  handle: string;
  isFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [showConfirm, setShowConfirm] = useState(false);
  const [, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // Already following → show nothing
  if (following && !showConfirm) return null;

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
      className="rounded-xl border border-brand-pink px-3.5 py-1 text-sm font-semibold text-brand-pink transition hover:bg-brand-pink/5 active:scale-95"
    >
      Sledovať
    </button>
  );
}
