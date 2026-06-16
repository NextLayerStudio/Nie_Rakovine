import Link from "next/link";
import { ForumThreadLikeButton } from "@/components/ForumThreadLikeButton";

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
    <article className="forum-card">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-pink to-brand-purple text-xs font-bold text-white ring-2 ring-white"
          >
            {initials(authorName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-brand-purple">
              {authorName}
            </p>
            {isPending && (
              <span className="mt-0.5 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200/80">
                Čaká na schválenie
              </span>
            )}
          </div>
        </div>

        <Link href={threadHref} className="mt-3 block">
          {title && (
            <h3 className="text-[15px] font-bold leading-snug text-brand-purple">
              {title}
            </h3>
          )}
          <p className="mt-1.5 line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-brand-purple/80">
            {body}
          </p>
          {coverUrl && (
            <div
              className="mt-3 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-cover bg-center ring-1 ring-brand-purple/10"
              style={{ backgroundImage: `url(${coverUrl})` }}
            />
          )}
        </Link>

        <div className="mt-4 flex items-center gap-4 border-t border-brand-purple/[0.06] pt-3 text-brand-purple/70">
          <ForumThreadLikeButton
            threadId={threadId}
            forumId={forumId}
            liked={liked}
            count={likeCount}
            variant="inline"
          />
          <Link
            href={threadHref}
            className="flex items-center gap-1.5 rounded-full bg-brand-purple/[0.06] px-3 py-1.5 text-xs font-semibold text-brand-purple/80 transition hover:bg-brand-purple/10"
          >
            <CommentIcon />
            {commentCount}
          </Link>
        </div>
      </div>
    </article>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
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
