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
    <div
      className="relative aspect-[4/3] max-h-[300px] w-full overflow-hidden"
      style={
        coverUrl
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${coverUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: fallback }
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
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
