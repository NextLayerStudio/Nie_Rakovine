"use client";

import { toggleForumThreadLikeAction } from "@/lib/actions/forums";

export function ForumThreadLikeButton({
  threadId,
  forumId,
  liked,
  count,
  variant = "pill",
}: {
  threadId: string;
  forumId: string;
  liked: boolean;
  count: number;
  variant?: "pill" | "inline";
}) {
  const pillClass = `flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold ${
    liked
      ? "bg-brand-pink text-white"
      : "bg-brand-purple/10 text-brand-purple"
  }`;
  const inlineClass = `flex items-center gap-1.5 text-xs ${
    liked ? "text-brand-pink" : "text-brand-purple/70"
  }`;

  return (
    <form action={toggleForumThreadLikeAction}>
      <input type="hidden" name="threadId" value={threadId} />
      <input type="hidden" name="forumId" value={forumId} />
      <button
        type="submit"
        className={variant === "pill" ? pillClass : inlineClass}
      >
        <HeartIcon filled={liked} />
        {count > 0 ? count : variant === "pill" ? "Páči sa" : "0"}
      </button>
    </form>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M12 21s-7-4-7-10a4.5 4.5 0 019-2.2A4.5 4.5 0 0119 11c0 6-7 10-7 10z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
