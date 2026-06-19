"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { PostType } from "@prisma/client";
import { FeedPostMedia } from "@/components/FeedPostMedia";
import { LikeButton } from "@/components/LikeButton";
import { PostCommentDrawer } from "@/components/PostCommentDrawer";
import { togglePostLikeAction } from "@/lib/actions/post-likes";

export function FeedPostItem({
  postId,
  href,
  type,
  title,
  excerpt,
  imageUrls,
  liked: initialLiked,
  likeCount: initialLikeCount,
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
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentOpen, setCommentOpen] = useState(false);
  const [, startTransition] = useTransition();

  const toggleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => c + (newLiked ? 1 : -1));
    const fd = new FormData();
    fd.set("postId", postId);
    startTransition(() => { void togglePostLikeAction(fd); });
  };

  const handleDoubleTap = () => {
    if (!liked) toggleLike();
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
          onDoubleTapLike={handleDoubleTap}
          likeSlot={
            <LikeButton
              postId={postId}
              liked={liked}
              count={likeCount}
              variant="feed"
              onToggle={toggleLike}
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
