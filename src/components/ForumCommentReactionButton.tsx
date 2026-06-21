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
}: {
  commentId: string;
  threadId: string;
  forumId: string;
  liked: boolean;
  count: number;
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
        "inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-semibold transition disabled:opacity-60",
        liked
          ? "bg-brand-pink/15 text-brand-pink"
          : "bg-brand-purple/5 text-brand-purple/55 hover:bg-brand-purple/10 hover:text-brand-purple/75",
      )}
    >
      <HeartIcon filled={liked} />
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
    <div className="mb-2 rounded-xl border-l-[3px] border-brand-pink bg-brand-pink/8 px-3 py-2">
      <p className="text-[11px] font-semibold text-brand-purple/70">
        {authorName}
      </p>
      <p className="mt-0.5 line-clamp-3 whitespace-pre-wrap text-xs leading-snug text-brand-purple/65">
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
  body,
  pendingModeration,
  liked,
  likeCount,
  replyTo,
  canReact,
  onReply,
}: {
  commentId: string;
  threadId: string;
  forumId: string;
  authorName: string;
  body: string;
  pendingModeration: boolean;
  liked: boolean;
  likeCount: number;
  replyTo: { authorName: string; body: string } | null;
  canReact: boolean;
  onReply: () => void;
}) {
  return (
    <li className="forum-chat-bubble">
      {pendingModeration && (
        <span className="mb-2 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
          Čaká na overenie
        </span>
      )}

      {replyTo && (
        <QuotedMessage authorName={replyTo.authorName} body={replyTo.body} />
      )}

      <div className="flex items-center gap-2">
        <div
          aria-hidden
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-purple/10 text-[10px] font-bold text-brand-purple"
        >
          {initials(authorName)}
        </div>
        <p className="text-xs font-semibold text-brand-purple">{authorName}</p>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-brand-purple/85">
        {body}
      </p>

      <div className="mt-2 flex items-center justify-end gap-2">
        <ForumCommentReactionButton
          commentId={commentId}
          threadId={threadId}
          forumId={forumId}
          liked={liked}
          count={likeCount}
        />
        {canReact && (
          <button
            type="button"
            onClick={onReply}
            className="rounded-pill bg-brand-purple/5 px-2.5 py-0.5 text-[11px] font-semibold text-brand-purple/55 transition hover:bg-brand-purple/10 hover:text-brand-purple/75"
          >
            Reagovať
          </button>
        )}
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
