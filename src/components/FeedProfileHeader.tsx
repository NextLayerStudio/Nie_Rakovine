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
    <div className="flex items-center gap-3 px-4 py-3">
      <Link href={`/home/profiles/${handle}`} className="shrink-0">
        <div
          aria-hidden
          className="h-14 w-14 rounded-full ring-2 ring-brand-purple/10"
          style={avatarStyle}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/home/profiles/${handle}`}>
          <span className="block truncate text-base font-bold text-brand-purple leading-tight">
            {displayName}
          </span>
        </Link>
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
