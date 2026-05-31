"use client";

import { toggleForumFollowAction } from "@/lib/actions/forums";

export function ForumFollowButton({
  forumId,
  isFollowing,
  size = "sm",
}: {
  forumId: string;
  isFollowing: boolean;
  size?: "sm" | "md";
}) {
  const sizing =
    size === "md" ? "px-4 py-1.5 text-xs" : "px-3 py-1 text-[10px]";

  return (
    <form action={toggleForumFollowAction}>
      <input type="hidden" name="forumId" value={forumId} />
      <button
        type="submit"
        className={`shrink-0 rounded-pill font-semibold ${sizing} ${
          isFollowing
            ? "border border-brand-purple/30 bg-brand-purple/10 text-brand-purple"
            : "border border-brand-pink text-brand-pink"
        }`}
      >
        {isFollowing ? "Sledujem" : "Sledovať"}
      </button>
    </form>
  );
}
