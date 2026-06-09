import Link from "next/link";
import { ForumThreadLikeButton } from "@/components/ForumThreadLikeButton";
import { profileAvatarStyle } from "@/lib/avatar-style";

export function ForumPostCard({
  forumId,
  threadId,
  authorName,
  title,
  body,
  coverUrl,
  liked,
  likeCount,
  commentCount,
  isPending = false,
}: {
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
}) {
  const threadHref = `/home/forums/${forumId}/${threadId}`;
  return (
    <article className="border-b border-brand-purple/10 pb-4">
      <div className="flex items-center gap-2">
        <div
          aria-hidden
          className="h-9 w-9 shrink-0 rounded-full bg-cover bg-center"
          style={profileAvatarStyle(null)}
        />
        <span className="truncate text-sm font-semibold text-brand-purple">
          {authorName}
        </span>
        {isPending && (
          <span className="shrink-0 rounded-pill bg-brand-pink-soft px-2 py-0.5 text-[10px] font-semibold text-brand-purple">
            Čaká na schválenie
          </span>
        )}
      </div>

      <Link href={threadHref} className="block">
        {title && (
          <h3 className="mt-2 text-sm font-bold text-brand-purple">{title}</h3>
        )}
        <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed text-brand-purple/90">
          {body}
        </p>
        {coverUrl && (
          <div
            className="mt-3 aspect-[16/10] w-full rounded-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
        )}
      </Link>

      <div className="mt-3 flex items-center gap-5 text-brand-purple/70">
        <ForumThreadLikeButton
          threadId={threadId}
          forumId={forumId}
          liked={liked}
          count={likeCount}
          variant="inline"
        />
        <Link href={threadHref} className="flex items-center gap-1.5 text-xs">
          <CommentIcon /> {commentCount}
        </Link>
        <span aria-hidden className="ml-auto text-brand-purple/60">
          <BookmarkIcon />
        </span>
      </div>
    </article>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 12a7 7 0 0112-4.95A7 7 0 0118 20H9l-4 3 1-4A7 7 0 014 12z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M6 4h12v16l-6-4-6 4V4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
