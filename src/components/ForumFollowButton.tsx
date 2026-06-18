"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleForumFollowAction } from "@/lib/actions/forums";

export function ForumFollowButton({
  forumId,
  isFollowing,
  size = "sm",
  joinLabel = "Sledovať",
  joinedLabel = "Sledujem",
}: {
  forumId: string;
  isFollowing: boolean;
  size?: "sm" | "md";
  joinLabel?: string;
  joinedLabel?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const sizing =
    size === "md" ? "px-4 py-2 text-xs" : "px-3 py-1.5 text-[10px]";

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await toggleForumFollowAction(formData);
          if (result.ok) {
            router.refresh();
          }
        });
      }}
    >
      <input type="hidden" name="forumId" value={forumId} />
      <button
        type="submit"
        disabled={pending}
        className={`shrink-0 rounded-full font-semibold shadow-sm transition active:scale-95 disabled:opacity-60 ${sizing} ${
          isFollowing
            ? "bg-brand-purple/10 text-brand-purple ring-1 ring-brand-purple/20"
            : "bg-brand-pink text-white hover:brightness-105"
        }`}
      >
        {pending ? "…" : isFollowing ? joinedLabel : joinLabel}
      </button>
    </form>
  );
}
