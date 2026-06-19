"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { PostType } from "@prisma/client";
import { FeedPostMedia } from "@/components/FeedPostMedia";
import { LikeButton } from "@/components/LikeButton";
import { PostCommentDrawer } from "@/components/PostCommentDrawer";
import { togglePostLikeAction } from "@/lib/actions/post-likes";
import { toggleSavedPostAction } from "@/lib/actions/post-saves";

export function FeedPostItem({
  postId,
  href,
  type,
  title,
  excerpt,
  imageUrls,
  videoUrl,
  liked: initialLiked,
  likeCount: initialLikeCount,
  saved: initialSaved,
}: {
  postId: string;
  href: string;
  type: PostType;
  title: string;
  excerpt: string | null;
  imageUrls: string[];
  videoUrl?: string | null;
  liked: boolean;
  likeCount: number;
  saved: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [saved, setSaved] = useState(initialSaved);
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

  const toggleSave = () => {
    setSaved((s) => !s);
    const fd = new FormData();
    fd.set("postId", postId);
    startTransition(() => { void toggleSavedPostAction(fd); });
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
          videoUrl={videoUrl}
          postId={postId}
          onCommentOpen={() => setCommentOpen(true)}
          onDoubleTapLike={handleDoubleTap}
          saved={saved}
          onSave={toggleSave}
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
            <h3 className="text-base font-bold text-brand-purple">{title}</h3>
            {excerpt && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-brand-purple/70">
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
