"use client";

import { useTransition, useState } from "react";
import { togglePostLikeAction } from "@/lib/actions/post-likes";

export function LikeButton({
  postId,
  liked: initialLiked,
  count: initialCount,
  variant = "pill",
}: {
  postId: string;
  liked: boolean;
  count: number;
  variant?: "pill" | "feed";
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((c) => c + (newLiked ? 1 : -1));
    const fd = new FormData();
    fd.set("postId", postId);
    startTransition(() => togglePostLikeAction(fd));
  };

  const pillClass = `flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold disabled:opacity-60 transition-colors ${
    liked ? "bg-brand-pink text-white" : "bg-brand-purple/10 text-brand-purple"
  }`;
  const feedClass = `flex items-center gap-1.5 text-sm disabled:opacity-60 transition-colors ${
    liked ? "text-brand-pink" : "text-brand-purple/80"
  }`;

  return (
    <button
      type="button"
      disabled={pending}
      onClick={toggle}
      className={variant === "feed" ? feedClass : pillClass}
    >
      <HeartIcon filled={liked} large={variant === "feed"} />
      {variant === "feed" ? (
        <span className="text-xs font-medium">{count > 0 ? count : "Páči sa mi"}</span>
      ) : count > 0 ? count : "Páči sa"}
    </button>
  );
}

export function HeartIcon({ filled, large = false }: { filled: boolean; large?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={large ? "h-6 w-6" : "h-4 w-4"} aria-hidden>
      <path
        d="M12 21s-7-4-7-10a4.5 4.5 0 019-2.2A4.5 4.5 0 0119 11c0 6-7 10-7 10z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className="transition-all duration-150"
      />
    </svg>
  );
}
