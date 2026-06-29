"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FollowProfileButton } from "@/components/FollowProfileButton";
import { profileHrefWithReturn } from "@/lib/post-display";

export function FeedProfileHeader({
  profileId,
  displayName,
  handle,
  avatarUrl,
  isFollowing = false,
}: {
  profileId?: string | null;
  displayName: string;
  handle: string;
  avatarUrl: string | null;
  isFollowing?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const returnPath = query ? `${pathname}?${query}` : pathname;
  const profileHref = profileId ? profileHrefWithReturn(handle, returnPath) : null;

  const avatarStyle = avatarUrl
    ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : { background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)" };

  const avatar = (
    <div
      aria-hidden
      className="h-14 w-14 rounded-full ring-2 ring-brand-purple/10"
      style={avatarStyle}
    />
  );

  const name = (
    <span className="block truncate text-base font-bold text-brand-purple leading-tight">
      {displayName}
    </span>
  );

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      {profileHref ? (
        <Link href={profileHref} className="shrink-0" aria-label={`Zobraziť profil ${displayName}`}>
          {avatar}
        </Link>
      ) : (
        <div className="shrink-0">{avatar}</div>
      )}

      <div className="min-w-0 flex-1">
        {profileHref ? (
          <Link href={profileHref} className="block w-full text-left">
            {name}
          </Link>
        ) : (
          name
        )}
        <span className="block text-xs text-brand-purple/50">@{handle}</span>
      </div>

      {profileId && (
        <div className="shrink-0">
          <FollowProfileButton
            profileId={profileId}
            handle={handle}
            isFollowing={isFollowing}
          />
        </div>
      )}
    </div>
  );
}
