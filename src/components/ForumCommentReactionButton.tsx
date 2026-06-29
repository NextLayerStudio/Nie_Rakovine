"use client";

import { useEffect, useState, useTransition } from "react";
import { HeartIcon } from "@/components/LikeButton";
import { toggleForumCommentLikeAction } from "@/lib/actions/forums";
import { cn } from "@/lib/utils";

export function ForumCommentReactionButton({
  commentId,
  threadId,
  forumId,
  liked: likedProp,
  count: countProp,
  variant = "pill",
}: {
  commentId: string;
  threadId: string;
  forumId: string;
  liked: boolean;
  count: number;
  variant?: "pill" | "plain";
}) {
  const [liked, setLiked] = useState(likedProp);
  const [count, setCount] = useState(countProp);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setLiked(likedProp);
    setCount(countProp);
  }, [likedProp, countProp]);

  const handleClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((c) => Math.max(0, c + (newLiked ? 1 : -1)));

    const fd = new FormData();
    fd.set("commentId", commentId);
    fd.set("threadId", threadId);
    fd.set("forumId", forumId);
    startTransition(() => {
      void toggleForumCommentLikeAction(fd);
    });
  };

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      aria-label={liked ? "Odstrániť srdiečko" : "Páči sa mi"}
      className={cn(
        "inline-flex items-center gap-1 transition disabled:opacity-60",
        variant === "plain"
          ? liked
            ? "text-brand-pink"
            : "text-brand-purple/45 hover:text-brand-purple/70"
          : cn(
              "rounded-pill px-2 py-0.5 text-[11px] font-semibold",
              liked
                ? "bg-brand-pink/15 text-brand-pink"
                : "bg-brand-purple/5 text-brand-purple/55 hover:bg-brand-purple/10 hover:text-brand-purple/75",
            ),
      )}
    >
      <HeartIcon filled={liked} size={variant === "plain" ? "sm" : undefined} />
      {count > 0 ? <span>{count}</span> : null}
    </button>
  );
}

function QuotedMessage({
  authorName,
  body,
}: {
  authorName: string;
  body: string;
}) {
  const preview =
    body.length > 120 ? `${body.slice(0, 117).trimEnd()}…` : body;

  return (
    <div className="mb-2 border-l-2 border-brand-purple/15 pl-2.5">
      <p className="text-[11px] font-semibold text-brand-purple/55">
        {authorName}
      </p>
      <p className="mt-0.5 line-clamp-2 whitespace-pre-wrap text-xs leading-snug text-brand-purple/45">
        {preview}
      </p>
    </div>
  );
}

export function ForumChatBubble({
  commentId,
  threadId,
  forumId,
  authorName,
  avatarUrl,
  body,
  pendingModeration,
  liked,
  likeCount,
  replyTo,
  isReply,
  canReact,
  onReply,
}: {
  commentId: string;
  threadId: string;
  forumId: string;
  authorName: string;
  avatarUrl?: string | null;
  body: string;
  pendingModeration: boolean;
  liked: boolean;
  likeCount: number;
  replyTo: { authorName: string; body: string } | null;
  isReply?: boolean;
  canReact: boolean;
  onReply: () => void;
}) {
  return (
    <li
      className={cn(
        "relative",
        isReply ? "ml-7 border-l border-brand-purple/15 pl-4 pt-4" : "border-t border-brand-purple/8 py-5 first:border-t-0 first:pt-2",
      )}
    >
      {pendingModeration && (
        <span className="mb-2 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
          Čaká na overenie
        </span>
      )}

      <div className="flex gap-3">
        <div
          aria-hidden
          className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-brand-purple/10"
          style={avatarUrl ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          {!avatarUrl && (
            <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-brand-purple">
              {initials(authorName)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-brand-purple/60">{authorName}</p>

          {replyTo && (
            <div className="mt-2">
              <QuotedMessage authorName={replyTo.authorName} body={replyTo.body} />
            </div>
          )}

          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-brand-purple/85">
            {body}
          </p>

          <div className="mt-2 flex items-center gap-4">
            <ForumCommentReactionButton
              commentId={commentId}
              threadId={threadId}
              forumId={forumId}
              liked={liked}
              count={likeCount}
              variant="plain"
            />
            {canReact && (
              <button
                type="button"
                onClick={onReply}
                className="text-xs font-semibold text-brand-purple/45 transition hover:text-brand-purple/70"
              >
                Reagovať
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
