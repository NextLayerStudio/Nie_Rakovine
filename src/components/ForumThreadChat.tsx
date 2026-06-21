"use client";

import { useState } from "react";
import { ForumChatBubble } from "@/components/ForumCommentReactionButton";
import { CommentForm } from "@/app/home/forums/[forumId]/[threadId]/CommentForm";

export type ForumChatMessage = {
  id: string;
  authorName: string;
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
  comments,
}: {
  forumId: string;
  threadId: string;
  canComment: boolean;
  comments: ForumChatMessage[];
}) {
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);

  return (
    <>
      {comments.length > 0 && (
        <>
          <h2 className="forum-section-label mb-3 mt-6">Chat</h2>
          <ul className="space-y-3">
            {comments.map((c) => (
              <ForumChatBubble
                key={c.id}
                commentId={c.id}
                threadId={threadId}
                forumId={forumId}
                authorName={c.authorName}
                body={c.body}
                pendingModeration={c.pendingModeration}
                liked={c.liked}
                likeCount={c.likeCount}
                replyTo={c.replyTo}
                canReact={canComment && !c.pendingModeration}
                onReply={() =>
                  setReplyTo({
                    commentId: c.id,
                    authorName: c.authorName,
                    body: c.body,
                  })
                }
              />
            ))}
          </ul>
        </>
      )}

      {canComment ? (
        <CommentForm
          forumId={forumId}
          threadId={threadId}
          replyTo={replyTo}
          onClearReply={() => setReplyTo(null)}
        />
      ) : null}
    </>
  );
}
