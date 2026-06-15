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
    <div className="flex items-start gap-3 px-4 py-2.5">
      <Link href={`/home/profiles/${handle}`} className="shrink-0">
        <div
          aria-hidden
          className="h-10 w-10 rounded-full"
          style={avatarStyle}
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/home/profiles/${handle}`}>
          <span className="block truncate text-sm font-bold text-brand-purple">
            {displayName}
          </span>
        </Link>
        {profileId ? (
          <div className="mt-1">
            <FollowProfileButton
              profileId={profileId}
              handle={handle}
              isFollowing={isFollowing}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
