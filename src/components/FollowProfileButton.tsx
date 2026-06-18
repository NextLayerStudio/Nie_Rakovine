"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleProfileFollowAction } from "@/lib/actions/follows";

export function FollowProfileButton({
  profileId,
  handle,
  isFollowing,
}: {
  profileId: string;
  handle: string;
  isFollowing: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await toggleProfileFollowAction(formData);
          router.refresh();
        });
      }}
    >
      <input type="hidden" name="profileId" value={profileId} />
      <input type="hidden" name="handle" value={handle} />
      <button
        type="submit"
        disabled={pending}
        className={`shrink-0 rounded-pill px-3 py-1 text-[10px] font-semibold disabled:opacity-60 ${
          isFollowing
            ? "border border-brand-purple/30 bg-brand-purple/10 text-brand-purple"
            : "border border-brand-pink text-brand-pink"
        }`}
      >
        {pending ? "…" : isFollowing ? "Sledujem" : "Sledovať"}
      </button>
    </form>
  );
}
