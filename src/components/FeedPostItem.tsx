"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
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
  audioUrl,
  liked: initialLiked,
  likeCount: initialLikeCount,
  commentCount: initialCommentCount,
  saved: initialSaved,
}: {
  postId: string;
  href: string;
  type: PostType;
  title: string;
  excerpt: string | null;
  imageUrls: string[];
  videoUrl?: string | null;
  audioUrl?: string | null;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  saved: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [saved, setSaved] = useState(initialSaved);
  const [commentOpen, setCommentOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setCommentCount(initialCommentCount);
  }, [initialCommentCount]);

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

  const isTextPost = type === "ARTICLE" || type === "RECIPE";

  return (
    <>
      {isTextPost ? (
        <ArticleCard
          href={href}
          title={title}
          excerpt={excerpt}
          coverUrl={imageUrls[0] ?? null}
          liked={liked}
          likeCount={likeCount}
          saved={saved}
          postId={postId}
          onLike={toggleLike}
          onSave={toggleSave}
          onCommentOpen={() => setCommentOpen(true)}
          commentCount={commentCount}
        />
      ) : (
        <MediaCard
          href={href}
          type={type}
          title={title}
          excerpt={excerpt}
          imageUrls={imageUrls}
          videoUrl={videoUrl}
          audioUrl={audioUrl}
          liked={liked}
          likeCount={likeCount}
          saved={saved}
          postId={postId}
          onLike={toggleLike}
          onSave={toggleSave}
          onCommentOpen={() => setCommentOpen(true)}
          commentCount={commentCount}
          onDoubleTap={handleDoubleTap}
        />
      )}

      <PostCommentDrawer
        postId={postId}
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        onCommentAdded={() => setCommentCount((c) => c + 1)}
      />
    </>
  );
}

/* ─── Reddit-style card for articles & recipes ─── */

function ArticleCard({
  href,
  title,
  excerpt,
  coverUrl,
  liked,
  likeCount,
  saved,
  postId,
  onLike,
  onSave,
  onCommentOpen,
  commentCount,
}: {
  href: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  liked: boolean;
  likeCount: number;
  saved: boolean;
  postId: string;
  onLike: () => void;
  onSave: () => void;
  onCommentOpen: () => void;
  commentCount: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const excerptRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = excerptRef.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight + 2);
  }, [excerpt]);

  return (
    <article className="border-b border-brand-purple/10">
      <Link href={href} className="flex items-start gap-3 px-4 pb-3 pt-2">
        {/* Text side */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-brand-purple">
            {title}
          </h3>
          {excerpt && (
            <div className="mt-1">
              <p
                ref={excerptRef}
                className={`text-sm leading-relaxed text-brand-purple/65 ${expanded ? "" : "line-clamp-3"}`}
              >
                {excerpt}
              </p>
              {(isClamped || expanded) && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setExpanded((v) => !v); }}
                  className="mt-0.5 text-xs font-semibold text-brand-purple/45"
                >
                  {expanded ? "Zobraziť menej" : "čítať viac"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Thumbnail */}
        {coverUrl && (
          <div className="shrink-0 overflow-hidden rounded-xl" style={{ width: 108, height: 82 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="" className="h-full w-full object-cover" draggable={false} />
          </div>
        )}
      </Link>

      {/* Action bar */}
      <div className="flex items-center gap-5 px-4 pb-4">
        <LikeButton postId={postId} liked={liked} count={likeCount} variant="feed" onToggle={onLike} />
        <button type="button" aria-label="Komentáre" onClick={onCommentOpen} className="flex items-center gap-1.5 text-brand-purple/60">
          <CommentIcon />
          {commentCount > 0 && <span className="text-sm font-semibold">{commentCount}</span>}
        </button>
        <span className="flex-1" />
        <button
          type="button"
          aria-label={saved ? "Odložené" : "Uložiť"}
          onClick={onSave}
          className={`transition-colors ${saved ? "text-brand-purple" : "text-brand-purple/60"}`}
        >
          <BookmarkIcon filled={saved} />
        </button>
      </div>
    </article>
  );
}

/* ─── Original media card for photos & videos ─── */

function MediaCard({
  href,
  type,
  title,
  excerpt,
  imageUrls,
  videoUrl,
  audioUrl,
  liked,
  likeCount,
  saved,
  postId,
  onLike,
  onSave,
  onCommentOpen,
  commentCount,
  onDoubleTap,
}: {
  href: string;
  type: PostType;
  title: string;
  excerpt: string | null;
  imageUrls: string[];
  videoUrl?: string | null;
  audioUrl?: string | null;
  liked: boolean;
  likeCount: number;
  saved: boolean;
  postId: string;
  onLike: () => void;
  onSave: () => void;
  onCommentOpen: () => void;
  commentCount: number;
  onDoubleTap: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const excerptRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = excerptRef.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight + 2);
  }, [excerpt]);

  return (
    <article className="border-b border-brand-purple/10">
      <FeedPostMedia
        href={href}
        type={type}
        imageUrls={imageUrls}
        videoUrl={videoUrl}
        audioUrl={audioUrl}
        postId={postId}
        onCommentOpen={onCommentOpen}
        commentCount={commentCount}
        onDoubleTapLike={onDoubleTap}
        saved={saved}
        onSave={onSave}
        likeSlot={
          <LikeButton postId={postId} liked={liked} count={likeCount} variant="feed" onToggle={onLike} />
        }
      />

      <div className="px-4 pb-7">
        <Link href={href}>
          <h3 className="text-base font-bold text-brand-purple">{title}</h3>
        </Link>

        {excerpt && (
          <div className="mt-0.5">
            <p
              ref={excerptRef}
              className={`text-sm leading-relaxed text-brand-purple/70 ${expanded ? "" : "line-clamp-2"}`}
            >
              {excerpt}
            </p>
            {(isClamped || expanded) && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="mt-0.5 text-xs font-semibold text-brand-purple/50 hover:text-brand-purple/80"
              >
                {expanded ? "Zobraziť menej" : "čítať viac"}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
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

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
