"use client";

import { useRef, useState } from "react";
import { extractVideoEmbedUrl } from "@/lib/post-display";

export function FeedVideoPlayer({
  videoUrl,
  coverUrl,
}: {
  videoUrl: string;
  coverUrl: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedUrl = extractVideoEmbedUrl(videoUrl);

  const goFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = iframeRef.current ?? containerRef.current;
    el?.requestFullscreen?.().catch(() => {});
  };

  if (!playing || !embedUrl) {
    return (
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden bg-black"
        onClick={() => setPlaying(true)}
      >
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover opacity-80"
            draggable={false}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-[#f3c3a2] to-[#d98c80]" />
        )}

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90 shadow-lg text-brand-purple transition hover:scale-105">
            <svg viewBox="0 0 24 24" className="h-7 w-7 translate-x-0.5" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration badge placeholder */}
        <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-xs font-bold text-white">
          VIDEO
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden bg-black"
    >
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="h-full w-full"
        allow="autoplay; fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video"
      />

      {/* Fullscreen button */}
      <button
        type="button"
        onClick={goFullscreen}
        aria-label="Celá obrazovka"
        className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-lg bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
