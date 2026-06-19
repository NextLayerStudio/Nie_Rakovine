"use client";

import { useTransition, useState } from "react";
import { togglePostLikeAction } from "@/lib/actions/post-likes";

/**
 * Controlled mode: provide onToggle — parent owns state, parent fires server action.
 * Self-contained mode: omit onToggle — component owns state and fires server action.
 */
export function LikeButton({
  postId,
  liked: likedProp,
  count: countProp,
  variant = "pill",
  onToggle,
}: {
  postId: string;
  liked: boolean;
  count: number;
  variant?: "pill" | "feed";
  onToggle?: () => void;
}) {
  const [internalLiked, setInternalLiked] = useState(likedProp);
  const [internalCount, setInternalCount] = useState(countProp);
  const [pending, startTransition] = useTransition();

  const controlled = onToggle !== undefined;
  const liked = controlled ? likedProp : internalLiked;
  const count = controlled ? countProp : internalCount;

  const handleClick = () => {
    if (controlled) {
      onToggle();
    } else {
      const newLiked = !internalLiked;
      setInternalLiked(newLiked);
      setInternalCount((c) => c + (newLiked ? 1 : -1));
      const fd = new FormData();
      fd.set("postId", postId);
      startTransition(() => { void togglePostLikeAction(fd); });
    }
  };

  const pillClass = `flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-semibold disabled:opacity-60 transition-colors ${
    liked ? "bg-brand-pink text-white" : "bg-brand-purple/10 text-brand-purple"
  }`;
  const feedClass = `flex items-center gap-1.5 disabled:opacity-60 transition-colors ${
    liked ? "text-brand-pink" : "text-brand-purple/60"
  }`;

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className={variant === "feed" ? feedClass : pillClass}
    >
      <HeartIcon filled={liked} large={variant === "feed"} />
      {variant === "feed" ? (
        <span className="text-sm font-semibold">{count > 0 ? count : "Páči sa mi"}</span>
      ) : count > 0 ? count : "Páči sa"}
    </button>
  );
}

export function HeartIcon({ filled, large = false }: { filled: boolean; large?: boolean }) {
  const size = large ? "h-7 w-7" : "h-4 w-4";
  return (
    <svg viewBox="0 0 24 24" className={size} aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? "0" : "2"}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-150"
      />
    </svg>
  );
}
