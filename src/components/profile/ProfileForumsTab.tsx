import Link from "next/link";
import { ForumPostCard } from "@/components/ForumPostCard";
import { forumAvatarStyle } from "@/lib/avatar-style";
import { forumHrefWithReturn } from "@/lib/post-display";

const PROFILE_FORUMS_RETURN = "/profile?tab=forums";

export type ProfileForumChip = {
  id: string;
  title: string;
  imageUrl: string | null;
  accentColor: string | null;
  hasRecentActivity: boolean;
};

export type ProfileForumPost = {
  forumId: string;
  threadId: string;
  authorName: string;
  title: string | null;
  body: string;
  coverUrl: string | null;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  isPending?: boolean;
};

export function ProfileForumsTab({
  forums,
  posts,
}: {
  forums: ProfileForumChip[];
  posts: ProfileForumPost[];
}) {
  return (
    <div className="pb-6 pt-3">
      {forums.length > 0 && (
        <div className="mb-4 overflow-x-auto px-4 pb-1">
          <div className="flex gap-3">
            {forums.map((forum) => (
              <Link
                key={forum.id}
                href={forumHrefWithReturn(forum.id, PROFILE_FORUMS_RETURN)}
                className="relative shrink-0"
                aria-label={forum.title}
              >
                <div
                  className="h-14 w-14 rounded-full ring-2 ring-white"
                  style={forumAvatarStyle(forum)}
                  aria-hidden
                />
                {forum.hasRecentActivity && (
                  <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 px-4 text-sm font-bold text-brand-purple">
        Moje príspevky
      </h2>

      {posts.length === 0 ? (
        <p className="px-4 text-center text-xs text-brand-purple/55">
          {forums.length === 0
            ? "Zatiaľ nesledujete žiadne fóra."
            : "Zatiaľ ste nepridali žiadny príspevok do fór."}
        </p>
      ) : (
        <div className="flex flex-col">
          {posts.map((post) => (
            <ForumPostCard
              key={post.threadId}
              forumId={post.forumId}
              threadId={post.threadId}
              authorName={post.authorName}
              title={post.title}
              body={post.body}
              coverUrl={post.coverUrl}
              liked={post.liked}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              isPending={post.isPending}
              returnPath={PROFILE_FORUMS_RETURN}
            />
          ))}
        </div>
      )}
    </div>
  );
}
