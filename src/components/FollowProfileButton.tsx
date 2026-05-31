"use client";

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
  return (
    <form action={toggleProfileFollowAction}>
      <input type="hidden" name="profileId" value={profileId} />
      <input type="hidden" name="handle" value={handle} />
      <button
        type="submit"
        className={`shrink-0 rounded-pill px-3 py-1 text-[10px] font-semibold ${
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
