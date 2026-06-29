"use client";

import Link from "next/link";
import { ForumThreadLikeButton } from "@/components/ForumThreadLikeButton";
import { forumThreadHrefWithReturn } from "@/lib/post-display";

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
  returnPath,
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
  returnPath?: string;
  footerSlot?: React.ReactNode;
  statusBadge?: React.ReactNode;
  compact?: boolean;
  className?: string;
}) {
  const threadHref = returnPath
    ? forumThreadHrefWithReturn(forumId, threadId, returnPath)
    : `/home/forums/${forumId}/${threadId}`;
  const adminPreview = !!footerSlot;

  const content = (
    <>
      {coverUrl && (
        <div
          className={`mb-3 w-full overflow-hidden rounded-2xl bg-cover bg-center ring-1 ring-brand-purple/10 ${
            compact ? "aspect-[4/3]" : "aspect-[16/10]"
          }`}
          style={{ backgroundImage: `url(${coverUrl})` }}
        />
      )}
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
        className={`whitespace-pre-wrap text-brand-purple/80 ${
          title ? "mt-1.5" : ""
        } ${
          compact
            ? "line-clamp-3 text-[11px] leading-snug"
            : "line-clamp-4 text-sm leading-relaxed"
        }`}
      >
        {body}
      </p>
    </>
  );

  return (
    <article
      className={`flex h-full flex-col border-b border-brand-purple/10 bg-white ${className}`}
    >
      <div className={`flex flex-1 flex-col ${compact ? "px-5 py-3" : "px-5 py-4"}`}>
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
          <div className="mt-4 flex items-center gap-5 border-t border-brand-purple/[0.06] pt-3">
            <ForumThreadLikeButton
              threadId={threadId}
              forumId={forumId}
              liked={liked}
              count={likeCount}
              iconSize="md"
            />
            <Link
              href={threadHref}
              aria-label="Komentáre"
              className="flex items-center gap-1.5 text-brand-purple/60"
            >
              <CommentIcon />
              {commentCount > 0 && (
                <span className="text-sm font-semibold">{commentCount}</span>
              )}
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
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
