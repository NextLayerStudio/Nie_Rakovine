"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { PostType } from "@prisma/client";
import { postCoverFallback } from "@/lib/post-display";
import { HeartIcon } from "@/components/LikeButton";

export function FeedPostMedia({
  href,
  type,
  imageUrls,
  likeSlot,
  postId,
  onCommentOpen,
  onDoubleTapLike,
}: {
  href: string;
  type: PostType;
  imageUrls: string[];
  likeSlot?: React.ReactNode;
  postId: string;
  onCommentOpen: () => void;
  onDoubleTapLike: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [heartFlash, setHeartFlash] = useState(false);
  const lastTapRef = useRef(0);

  const slides = imageUrls.length > 0 ? imageUrls : [postCoverFallback(type)];
  const multi = slides.length > 1;

  const updateIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !multi) return;
    const width = el.clientWidth || 1;
    const index = Math.round(el.scrollLeft / width);
    setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
  }, [multi, slides.length]);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      onDoubleTapLike();
      setHeartFlash(true);
      setTimeout(() => setHeartFlash(false), 800);
    }
    lastTapRef.current = now;
  };

  return (
    <>
      <div className="relative overflow-hidden" onClick={handleTap}>
        <div
          ref={scrollRef}
          onScroll={updateIndex}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth"
          aria-label={multi ? "Galéria — potiahnite do strán" : undefined}
        >
          {slides.map((slide, index) => (
            <div
              key={typeof slide === "string" ? `${slide}-${index}` : index}
              className="aspect-[4/3] max-h-[300px] w-full shrink-0 snap-center snap-always"
            >
              {typeof slide === "string" && slide.startsWith("linear-gradient") ? (
                <div className="h-full w-full" style={{ background: slide }} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide as string}
                  alt=""
                  className="h-full max-h-[300px] w-full object-cover"
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>

        {/* Double-tap heart flash */}
        {heartFlash && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-ping-once text-white drop-shadow-lg">
              <svg viewBox="0 0 24 24" className="h-20 w-20" aria-hidden>
                <path
                  d="M12 21s-7-4-7-10a4.5 4.5 0 019-2.2A4.5 4.5 0 0119 11c0 6-7 10-7 10z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>
        )}

        {type === "VIDEO" && (
          <>
            <span className="pointer-events-none absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-purple shadow-soft">
              <PlayIcon />
            </span>
            <Link
              href={href}
              className="absolute bottom-4 left-4 rounded-full bg-[#2a9d8f] px-4 py-2 text-xs font-semibold text-white"
              onClick={(e) => e.stopPropagation()}
            >
              Pozrieť celé video ›
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4 px-4 py-2.5">
        {likeSlot}
        <button
          type="button"
          aria-label="Komentáre"
          onClick={onCommentOpen}
          className="text-brand-purple/80"
        >
          <CommentIcon />
        </button>
        <span className="flex flex-1 items-center justify-center gap-1.5" aria-hidden>
          {multi ? (
            slides.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  index === activeIndex ? "bg-brand-purple" : "bg-brand-purple/25"
                }`}
              />
            ))
          ) : null}
        </span>
        <span aria-hidden className="text-brand-purple/80">
          <BookmarkIcon />
        </span>
      </div>
    </>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="M4 12a7 7 0 0112-4.95A7 7 0 0118 20H9l-4 3 1-4A7 7 0 014 12z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
