"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostType } from "@prisma/client";
import { FeedPostMedia } from "@/components/FeedPostMedia";
import { LikeButton } from "@/components/LikeButton";
import { PostCommentDrawer } from "@/components/PostCommentDrawer";

export function FeedPostItem({
  postId,
  href,
  type,
  title,
  excerpt,
  imageUrls,
  liked,
  likeCount,
}: {
  postId: string;
  href: string;
  type: PostType;
  title: string;
  excerpt: string | null;
  imageUrls: string[];
  liked: boolean;
  likeCount: number;
}) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked_, setLiked] = useState(liked);
  const [likeCount_, setLikeCount] = useState(likeCount);

  const handleDoubleTapLike = () => {
    if (!liked_) {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  return (
    <>
      <article className="border-b border-brand-purple/10">
        <FeedPostMedia
          href={href}
          type={type}
          imageUrls={imageUrls}
          postId={postId}
          onCommentOpen={() => setCommentOpen(true)}
          onDoubleTapLike={handleDoubleTapLike}
          likeSlot={
            <LikeButton
              postId={postId}
              liked={liked_}
              count={likeCount_}
              variant="feed"
            />
          }
        />

        <div className="px-4 pb-7">
          <Link href={href}>
            <h3 className="text-sm font-semibold text-brand-purple">{title}</h3>
            {excerpt && (
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-brand-purple/70">
                {excerpt}
              </p>
            )}
          </Link>
        </div>
      </article>

      <PostCommentDrawer
        postId={postId}
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
      />
    </>
  );
}
