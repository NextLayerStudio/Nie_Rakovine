import Link from "next/link";
import { FollowProfileButton } from "@/components/FollowProfileButton";

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
  const avatarStyle = avatarUrl
    ? {
        backgroundImage: `url(${avatarUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : {
        background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)",
      };

  return (
    <div className="flex items-center justify-between px-4 pt-3">
      <Link
        href={`/home/profiles/${handle}`}
        className="flex min-w-0 items-center gap-2"
      >
        <div
          aria-hidden
          className="h-9 w-9 shrink-0 rounded-full"
          style={avatarStyle}
        />
        <span className="truncate text-sm font-bold text-brand-purple">
          {displayName}
        </span>
      </Link>
      {profileId ? (
        <FollowProfileButton
          profileId={profileId}
          handle={handle}
          isFollowing={isFollowing}
        />
      ) : null}
    </div>
  );
}
