"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import type { PostType } from "@prisma/client";
import { FeedAudioPlayer } from "@/components/FeedAudioPlayer";
import { LikeButton } from "@/components/LikeButton";
import { PostCommentDrawer } from "@/components/PostCommentDrawer";
import { PostImageCarousel } from "@/components/PostImageCarousel";
import {
  fetchPostDetailAction,
  type PostDetailPayload,
} from "@/lib/actions/post-detail";
import { togglePostLikeAction } from "@/lib/actions/post-likes";
import {
  extractVideoEmbedUrl,
  isEmbeddableVideo,
  isLocalMedia,
  postKindLabel,
} from "@/lib/post-display";

export function PostDetailModal({
  postId,
  onClose,
}: {
  postId: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [post, setPost] = useState<PostDetailPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    startTransition(() => {
      void fetchPostDetailAction(postId).then((res) => {
        if (res.ok) {
          setPost(res.post);
          setError(null);
        } else {
          setError(res.message);
        }
      });
    });
  }, [postId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !commentOpen) onClose();
    };
    document.addEventListener("keydown", onKey);

    const scrollEl = document.querySelector<HTMLElement>("[data-app-scroll]");
    const prev = scrollEl?.style.overflow ?? "";
    if (scrollEl) scrollEl.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      if (scrollEl) scrollEl.style.overflow = prev;
    };
  }, [onClose, commentOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-modal-title"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/50"
          aria-label="Zavrieť"
          onClick={onClose}
        />

        <div className="relative flex max-h-[min(92dvh,780px)] w-full max-w-[420px] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-card sm:rounded-[28px]">
          <div className="flex shrink-0 items-center justify-between border-b border-brand-purple/10 px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-purple/60">
              Príspevok
            </span>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full text-brand-purple/50 transition hover:bg-brand-purple/5 hover:text-brand-purple"
              aria-label="Zavrieť"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="no-scrollbar flex-1 overflow-y-auto">
            {!post && !error && (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-brand-purple/50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-purple/20 border-t-brand-purple" />
                <p className="text-sm">Načítavam…</p>
              </div>
            )}

            {error && (
              <div className="px-5 py-16 text-center text-sm text-brand-purple/60">
                {error}
              </div>
            )}

            {post && (
              <PostModalBody
                post={post}
                onCommentOpen={() => setCommentOpen(true)}
                onLikeChange={(liked, count) =>
                  setPost((prev) =>
                    prev ? { ...prev, liked, likeCount: count } : prev,
                  )
                }
                onSaveChange={(saved) =>
                  setPost((prev) => (prev ? { ...prev, saved } : prev))
                }
              />
            )}
          </div>
        </div>
      </div>

      {post && (
        <PostCommentDrawer
          postId={post.id}
          open={commentOpen}
          onClose={() => setCommentOpen(false)}
          onCommentAdded={() =>
            setPost((prev) =>
              prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev,
            )
          }
        />
      )}
    </>,
    document.body,
  );
}

function PostModalBody({
  post,
  onCommentOpen,
  onLikeChange,
  onSaveChange,
}: {
  post: PostDetailPayload;
  onCommentOpen: () => void;
  onLikeChange: (liked: boolean, count: number) => void;
  onSaveChange: (saved: boolean) => void;
}) {
  const type = post.type as PostType;
  const isEditorial =
    type === "ARTICLE" || type === "RECIPE" || type === "NEWS";
  const [, startTransition] = useTransition();

  const toggleLike = () => {
    const next = !post.liked;
    onLikeChange(next, post.likeCount + (next ? 1 : -1));
    const fd = new FormData();
    fd.set("postId", post.id);
    startTransition(() => {
      void togglePostLikeAction(fd);
    });
  };

  return (
    <article>
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="rounded-pill bg-brand-purple/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-purple">
          {postKindLabel(type)}
        </span>
        {post.profileName && (
          <span className="text-xs font-medium text-brand-purple/60">
            {post.profileName}
          </span>
        )}
      </div>

      {type === "VIDEO" && post.videoUrl ? (
        <VideoBlock url={post.videoUrl} coverUrl={post.gallery[0] ?? null} />
      ) : type === "AUDIO" && post.audioUrl ? (
        <div className="mt-3 px-4">
          <FeedAudioPlayer
            audioUrl={post.audioUrl}
            coverUrl={post.gallery[0] ?? null}
          />
        </div>
      ) : (
        <div className="mt-3 px-4">
          <PostImageCarousel
            images={post.gallery}
            type={type}
            aspectClass="aspect-[4/3]"
            maxHeightClass=""
            showDots={post.gallery.length > 1}
          />
        </div>
      )}

      <div className="px-4 py-4">
        <h2
          id="post-modal-title"
          className={`font-bold leading-snug text-brand-purple ${
            isEditorial ? "text-xl" : "text-lg"
          }`}
        >
          {post.title}
        </h2>

        {post.excerpt && (
          <p
            className={`mt-2 leading-relaxed text-brand-purple/75 ${
              isEditorial
                ? "border-l-4 border-brand-pink/50 pl-4 text-sm italic"
                : "text-sm"
            }`}
          >
            {post.excerpt}
          </p>
        )}

        {post.body && (
          <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-brand-purple/90">
            {post.body}
          </div>
        )}

        <div className="mt-5 flex items-center gap-5 border-t border-brand-purple/10 pt-4">
          <LikeButton
            postId={post.id}
            liked={post.liked}
            count={post.likeCount}
            onToggle={toggleLike}
          />
          <button
            type="button"
            aria-label="Komentáre"
            onClick={onCommentOpen}
            className="flex items-center gap-1.5 text-brand-purple/60"
          >
            <CommentIcon />
            {post.commentCount > 0 && (
              <span className="text-sm font-semibold">{post.commentCount}</span>
            )}
          </button>
          <SaveButton
            postId={post.id}
            saved={post.saved}
            onChange={onSaveChange}
          />
        </div>
      </div>
    </article>
  );
}

function VideoBlock({
  url,
  coverUrl,
}: {
  url: string;
  coverUrl: string | null;
}) {
  const embed = extractVideoEmbedUrl(url);

  if (embed) {
    return (
      <div className="mt-3 bg-black">
        <iframe
          src={embed}
          title="Video"
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (
    isLocalMedia(url) ||
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".mov")
  ) {
    return (
      <div className="mt-3 bg-black">
        <video
          src={url}
          controls
          playsInline
          poster={coverUrl ?? undefined}
          className="aspect-video w-full"
        />
      </div>
    );
  }

  if (isEmbeddableVideo(url)) {
    return (
      <div className="mt-3 px-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex aspect-video items-center justify-center rounded-2xl bg-brand-purple/5 text-sm font-semibold text-brand-purple"
          style={
            coverUrl
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${coverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          Prehrať video ↗
        </a>
      </div>
    );
  }

  return (
    <div className="mt-3 px-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl bg-brand-pink px-4 py-3 text-center text-sm font-semibold text-white"
      >
        Otvoriť video
      </a>
    </div>
  );
}

function SaveButton({
  postId,
  saved,
  onChange,
}: {
  postId: string;
  saved: boolean;
  onChange: (saved: boolean) => void;
}) {
  const [, startTransition] = useTransition();

  const toggle = () => {
    const next = !saved;
    onChange(next);
    const fd = new FormData();
    fd.set("postId", postId);
    startTransition(async () => {
      const { toggleSavedPostAction } = await import("@/lib/actions/post-saves");
      void toggleSavedPostAction(fd);
    });
  };

  return (
    <button
      type="button"
      aria-label={saved ? "Odložené" : "Uložiť"}
      onClick={toggle}
      className={`ml-auto transition-colors ${saved ? "text-brand-purple" : "text-brand-purple/60"}`}
    >
      <BookmarkIcon filled={saved} />
    </button>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
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
