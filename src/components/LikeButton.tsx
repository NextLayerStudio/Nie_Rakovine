"use client";

import { togglePostLikeAction } from "@/lib/actions/posts";

export function LikeButton({
  postId,
  liked,
  count,
}: {
  postId: string;
  liked: boolean;
  count: number;
}) {
  return (
    <form action={togglePostLikeAction}>
      <input type="hidden" name="postId" value={postId} />
      <button
        type="submit"
        className={`flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold ${
          liked
            ? "bg-brand-pink text-white"
            : "bg-brand-purple/10 text-brand-purple"
        }`}
      >
        <HeartIcon filled={liked} />
        {count > 0 ? count : "Páči sa"}
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
