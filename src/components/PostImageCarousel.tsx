"use client";

import { useCallback, useRef, useState } from "react";
import type { PostType } from "@prisma/client";
import { postCoverFallback } from "@/lib/post-display";

export function PostImageCarousel({
  images,
  type = "ARTICLE",
  aspectClass = "aspect-[4/3]",
  maxHeightClass = "max-h-[220px]",
  overlay,
  showDots = true,
  className = "",
}: {
  images: string[];
  type?: PostType;
  aspectClass?: string;
  maxHeightClass?: string;
  overlay?: React.ReactNode;
  showDots?: boolean;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = images.length > 0 ? images : [postCoverFallback(type)];
  const multi = slides.length > 1;
  const sizeClass = [aspectClass, maxHeightClass].filter(Boolean).join(" ");

  const updateIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !multi) return;
    const width = el.clientWidth || 1;
    const index = Math.round(el.scrollLeft / width);
    setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
  }, [multi, slides.length]);

  return (
    <div className={className}>
      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={updateIndex}
          className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth`}
          aria-label={multi ? "Galéria obrázkov — potiahnite do strán" : undefined}
        >
          {slides.map((slide, index) => {
            const isGradient = slide.startsWith("linear-gradient");

            return (
              <div
                key={`${slide}-${index}`}
                className={`w-full shrink-0 snap-center snap-always ${sizeClass}`}
              >
                {isGradient ? (
                  <div className="h-full w-full" style={{ background: slide }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide}
                    alt=""
                    className={`h-full w-full object-cover ${maxHeightClass}`}
                    draggable={false}
                  />
                )}
              </div>
            );
          })}
        </div>

        {overlay && (
          <div className="pointer-events-none absolute inset-0">{overlay}</div>
        )}
      </div>

      {showDots && multi && (
        <div
          className="mt-2 flex items-center justify-center gap-1.5"
          aria-hidden
        >
          {slides.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                index === activeIndex ? "bg-brand-purple" : "bg-brand-purple/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
