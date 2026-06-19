"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { PostType } from "@prisma/client";
import { postCoverFallback } from "@/lib/post-display";

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
            <div className="animate-ping-once text-white drop-shadow-2xl">
              <svg viewBox="0 0 24 24" className="h-24 w-24" aria-hidden>
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  fill="currentColor"
                  stroke="white"
                  strokeWidth="0.5"
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

      <div className="flex items-center gap-5 px-4 py-3">
        {likeSlot}
        <button
          type="button"
          aria-label="Komentáre"
          onClick={onCommentOpen}
          className="text-brand-purple/60"
        >
          <CommentIcon />
        </button>
        <span className="flex flex-1 items-center justify-center gap-1.5" aria-hidden>
          {multi &&
            slides.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  index === activeIndex ? "bg-brand-purple" : "bg-brand-purple/25"
                }`}
              />
            ))}
        </span>
        <span aria-hidden className="text-brand-purple/60">
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

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
