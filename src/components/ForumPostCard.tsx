"use client";

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
  footerSlot,
  statusBadge,
  compact = false,
  className = "",
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
  footerSlot?: React.ReactNode;
  statusBadge?: React.ReactNode;
  compact?: boolean;
  className?: string;
}) {
  const threadHref = `/home/forums/${forumId}/${threadId}`;
  const adminPreview = !!footerSlot;

  const content = (
    <>
      {title && (
        <h3
          className={`font-bold leading-snug text-brand-purple ${
            compact ? "line-clamp-2 text-xs" : "text-[15px]"
          }`}
        >
          {title}
        </h3>
      )}
      <p
        className={`mt-1.5 whitespace-pre-wrap text-brand-purple/80 ${
          compact
            ? "line-clamp-3 text-[11px] leading-snug"
            : "line-clamp-4 text-sm leading-relaxed"
        }`}
      >
        {body}
      </p>
      {coverUrl && (
        <div
          className={`mt-3 w-full overflow-hidden rounded-2xl bg-cover bg-center ring-1 ring-brand-purple/10 ${
            compact ? "aspect-[4/3]" : "aspect-[16/10]"
          }`}
          style={{ backgroundImage: `url(${coverUrl})` }}
        />
      )}
    </>
  );

  return (
    <article
      className={`forum-card flex h-full flex-col overflow-hidden ${className}`}
    >
      <div className={`flex flex-1 flex-col ${compact ? "p-3" : "p-4"}`}>
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-pink to-brand-purple font-bold text-white ring-2 ring-white ${
              compact ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs"
            }`}
          >
            {initials(authorName)}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`truncate font-semibold text-brand-purple ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              {authorName}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {statusBadge}
              {isPending && !statusBadge && (
                <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200/80">
                  Čaká na schválenie
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex-1">
          {adminPreview ? content : <Link href={threadHref}>{content}</Link>}
        </div>

        {!footerSlot && (
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
        )}
      </div>

      {footerSlot}
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
