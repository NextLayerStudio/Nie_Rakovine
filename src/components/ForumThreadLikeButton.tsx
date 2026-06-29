"use client";

import { useEffect, useState, useTransition } from "react";
import { HeartIcon } from "@/components/LikeButton";
import { toggleForumThreadLikeAction } from "@/lib/actions/forums";

export function ForumThreadLikeButton({
  threadId,
  forumId,
  liked: likedProp,
  count: countProp,
  variant = "feed",
  iconSize,
}: {
  threadId: string;
  forumId: string;
  liked: boolean;
  count: number;
  variant?: "feed" | "pill";
  iconSize?: "sm" | "md" | "lg";
}) {
  const [liked, setLiked] = useState(likedProp);
  const [count, setCount] = useState(countProp);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setLiked(likedProp);
    setCount(countProp);
  }, [likedProp, countProp]);

  const handleClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((c) => c + (newLiked ? 1 : -1));

    const fd = new FormData();
    fd.set("threadId", threadId);
    fd.set("forumId", forumId);
    startTransition(() => {
      void toggleForumThreadLikeAction(fd);
    });
  };

  const feedClass = `flex items-center gap-1.5 disabled:opacity-60 transition-colors ${
    liked ? "text-brand-pink" : "text-brand-purple/60"
  }`;
  const pillClass = `flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-semibold disabled:opacity-60 transition-colors ${
    liked ? "bg-brand-pink text-white" : "bg-brand-purple/10 text-brand-purple"
  }`;

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className={variant === "feed" ? feedClass : pillClass}
    >
      <HeartIcon
        filled={liked}
        size={iconSize ?? (variant === "feed" ? "lg" : "sm")}
      />
      {variant === "feed" ? (
        <span className="text-sm font-semibold">
          {count > 0 ? count : "Páči sa mi"}
        </span>
      ) : count > 0 ? (
        count
      ) : (
        "Páči sa"
      )}
    </button>
  );
}
