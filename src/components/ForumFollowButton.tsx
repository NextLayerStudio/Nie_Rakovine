"use client";

import { useState, useTransition, useEffect } from "react";
import { toggleForumFollowAction } from "@/lib/actions/forums";
import { emitForumMembershipChange } from "@/lib/forum-membership-sync";

export function ForumFollowButton({
  forumId,
  isFollowing: initialFollowing,
  size = "sm",
  joinLabel = "Sledovať",
  joinedLabel = "Sledujem",
  onFollowingChange,
}: {
  forumId: string;
  isFollowing: boolean;
  size?: "sm" | "md";
  joinLabel?: string;
  joinedLabel?: string;
  onFollowingChange?: (following: boolean) => void;
}) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [, startTransition] = useTransition();
  const sizing =
    size === "md" ? "px-3.5 py-1.5 text-sm" : "px-3.5 py-1 text-sm";

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  const handleClick = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    onFollowingChange?.(next);
    emitForumMembershipChange(forumId, next);
    const fd = new FormData();
    fd.set("forumId", forumId);
    startTransition(async () => {
      const result = await toggleForumFollowAction(fd);
      if (!result.ok) {
        setIsFollowing(!next);
        onFollowingChange?.(!next);
        emitForumMembershipChange(forumId, !next);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`shrink-0 rounded-xl border font-semibold transition active:scale-95 ${sizing} ${
        isFollowing
          ? "border-brand-purple/20 text-brand-purple/40"
          : "border-brand-pink text-brand-pink hover:bg-brand-pink/5"
      }`}
    >
      {isFollowing ? joinedLabel : joinLabel}
    </button>
  );
}
