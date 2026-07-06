"use client";

import { postCoverFallback } from "@/lib/post-display";

export function FeedAudioPlayer({
  audioUrl,
  coverUrl,
}: {
  audioUrl: string;
  coverUrl?: string | null;
}) {
  const fallback = postCoverFallback("AUDIO");

  return (
    <div className="relative w-full overflow-hidden">
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt=""
          className="block max-h-[75vh] w-full h-auto object-contain"
          draggable={false}
        />
      ) : (
        <div className="aspect-[4/3] w-full" style={{ background: fallback }} />
      )}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-brand-purple shadow-lg">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
        </div>
        <audio
          src={audioUrl}
          controls
          preload="metadata"
          className="w-full max-w-sm"
        />
      </div>
    </div>
  );
}
