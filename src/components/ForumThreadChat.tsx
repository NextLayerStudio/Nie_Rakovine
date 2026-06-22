"use client";

import { useState } from "react";
import {
  ForumChatBubble,
} from "@/components/ForumCommentReactionButton";
import { CommentForm } from "@/app/home/forums/[forumId]/[threadId]/CommentForm";

export type ForumChatMessage = {
  id: string;
  authorName: string;
  avatarUrl?: string | null;
  body: string;
  pendingModeration: boolean;
  liked: boolean;
  likeCount: number;
  replyTo: { authorName: string; body: string } | null;
};

export type ReplyTarget = {
  commentId: string;
  authorName: string;
  body: string;
};

export function ForumThreadChat({
  forumId,
  threadId,
  canComment,
  comments: initialComments,
  currentUserName,
  currentAvatarUrl,
}: {
  forumId: string;
  threadId: string;
  canComment: boolean;
  comments: ForumChatMessage[];
  currentUserName?: string;
  currentAvatarUrl?: string | null;
}) {
  const [comments, setComments] = useState<ForumChatMessage[]>(initialComments);
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);

  function handleOptimisticSend(body: string) {
    const optimistic: ForumChatMessage = {
      id: `opt-${Date.now()}`,
      authorName: currentUserName ?? "Vy",
      avatarUrl: currentAvatarUrl ?? null,
      body,
      pendingModeration: true,
      liked: false,
      likeCount: 0,
      replyTo: replyTo
        ? { authorName: replyTo.authorName, body: replyTo.body }
        : null,
    };
    setComments((prev) => [...prev, optimistic]);
    setReplyTo(null);
  }

  return (
    <>
      {comments.length > 0 && (
        <>
          <h2 className="forum-section-label mb-3 mt-6">Chat</h2>
          <ul className="space-y-0">
            {comments.map((c, idx) => {
              const prevHasReply = idx > 0 && comments[idx - 1].replyTo !== null;
              const isReply = c.replyTo !== null;
              return (
                <ForumChatBubble
                  key={c.id}
                  commentId={c.id}
                  threadId={threadId}
                  forumId={forumId}
                  authorName={c.authorName}
                  avatarUrl={c.avatarUrl}
                  body={c.body}
                  pendingModeration={c.pendingModeration}
                  liked={c.liked}
                  likeCount={c.likeCount}
                  replyTo={c.replyTo}
                  isReply={isReply}
                  canReact={canComment && !c.pendingModeration}
                  onReply={() =>
                    setReplyTo({
                      commentId: c.id,
                      authorName: c.authorName,
                      body: c.body,
                    })
                  }
                />
              );
            })}
          </ul>
        </>
      )}

      {canComment ? (
        <CommentForm
          forumId={forumId}
          threadId={threadId}
          replyTo={replyTo}
          onClearReply={() => setReplyTo(null)}
          onOptimisticSend={handleOptimisticSend}
        />
      ) : null}
    </>
  );
}
