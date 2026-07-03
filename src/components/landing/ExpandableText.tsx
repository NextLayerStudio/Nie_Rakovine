"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Clamps free-form copy to a fixed height with a fade-out at the bottom,
 * and reveals a "Zobraziť viac" toggle only when the text actually overflows.
 * Used for content that gets filled in later (bios, testimonials, CMS copy)
 * and might end up longer than the space it was designed for.
 */
export function ExpandableText({
  children,
  maxHeight = 92,
  className = "",
  fadeColor = "#FFF3F9",
  align = "left",
}: {
  children: React.ReactNode;
  maxHeight?: number;
  className?: string;
  fadeColor?: string;
  align?: "left" | "center";
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  const overflowing = fullHeight !== null && fullHeight > maxHeight + 4;

  useEffect(() => {
    if (contentRef.current) setFullHeight(contentRef.current.scrollHeight);
  }, [children]);

  return (
    <div>
      <div
        className="relative overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: expanded ? (fullHeight ?? 2000) : maxHeight }}
      >
        <div ref={contentRef} className={className}>
          {children}
        </div>
        {!expanded && overflowing && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
            style={{ background: `linear-gradient(to bottom, transparent, ${fadeColor})` }}
          />
        )}
      </div>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`mt-1.5 text-xs font-bold text-[#FDA4C7] ${align === "center" ? "block w-full text-center" : ""}`}
        >
          {expanded ? "Zobraziť menej" : "Zobraziť viac"}
        </button>
      )}
    </div>
  );
}
