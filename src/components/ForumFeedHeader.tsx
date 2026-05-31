import Link from "next/link";
import { ForumFollowButton } from "@/components/ForumFollowButton";
import { forumAvatarStyle } from "@/lib/avatar-style";

export function ForumFeedHeader({
  forumId,
  title,
  imageUrl,
  accentColor,
  isFollowing,
}: {
  forumId: string;
  title: string;
  imageUrl: string | null;
  accentColor: string | null;
  isFollowing: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-3">
      <Link
        href={`/home/forums/${forumId}`}
        className="flex min-w-0 items-center gap-2"
      >
        <div
          aria-hidden
          className="h-9 w-9 shrink-0 rounded-full bg-cover bg-center"
          style={forumAvatarStyle({ imageUrl, accentColor })}
        />
        <span className="truncate text-sm font-bold uppercase tracking-wide text-brand-purple">
          {title}
        </span>
      </Link>
      <ForumFollowButton forumId={forumId} isFollowing={isFollowing} />
    </div>
  );
}
