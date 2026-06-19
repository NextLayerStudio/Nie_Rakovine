"use client";

import Link from "next/link";
import type { PostType } from "@prisma/client";
import { PostImageCarousel } from "@/components/PostImageCarousel";
import { postKindLabel } from "@/lib/post-display";

export function PostCard({
  href,
  type,
  title,
  excerpt,
  imageUrls,
  likeSlot,
  footerSlot,
  statusBadge,
  fullContent = false,
  compact = false,
  className = "mx-4 mb-3",
}: {
  href: string;
  type: PostType;
  title: string;
  excerpt: string | null;
  imageUrls: string[];
  likeSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  statusBadge?: React.ReactNode;
  fullContent?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const clampTitle = compact || !fullContent;
  const clampExcerpt = compact || !fullContent;

  return (
    <article
      className={`card flex h-full flex-col overflow-hidden ${className}`}
    >
      <div
        className={`flex items-center justify-between gap-2 ${
          compact ? "px-3 pt-2" : "px-4 pt-2"
        }`}
      >
        <span className="rounded-pill bg-brand-purple/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand-purple sm:px-3 sm:text-[10px]">
          {postKindLabel(type)}
        </span>
        {statusBadge}
      </div>

      <div className={compact ? "mt-1.5" : "mt-2"}>
        <PostImageCarousel
          images={imageUrls}
          type={type}
          aspectClass={compact ? "aspect-[4/3]" : "aspect-[16/9]"}
          maxHeightClass=""
          showDots={!compact}
        />
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "px-3 py-2" : "px-4 py-2"}`}>
        <h3
          className={`font-semibold text-brand-purple ${
            compact ? "line-clamp-2 text-xs" : clampTitle ? "line-clamp-1 text-sm" : "text-sm"
          }`}
        >
          {title}
        </h3>
        {excerpt && (
          <p
            className={`mt-0.5 text-brand-purple/70 ${
              compact
                ? "line-clamp-2 text-[11px] leading-snug"
                : clampExcerpt
                  ? "line-clamp-1 text-xs"
                  : "text-xs leading-relaxed"
            }`}
          >
            {excerpt}
          </p>
        )}
        {!footerSlot && (
          <div className="mt-2 flex items-center justify-between gap-2">
            {likeSlot}
            <Link
              href={href}
              className="ml-auto rounded-pill bg-brand-pink px-4 py-1.5 text-xs font-semibold text-white"
            >
              {type === "VIDEO"
                ? "Pozrieť"
                : type === "RECIPE"
                  ? "Recept"
                  : type === "AUDIO"
                    ? "Počúvať"
                    : "Prečítať"}
            </Link>
          </div>
        )}
      </div>

      {footerSlot}
    </article>
  );
}

export function EventCard({
  id,
  title,
  description,
  startsAt,
  location,
  coverUrl,
  footerSlot,
  statusBadge,
  fullContent = false,
  compact = false,
  className = "mx-4 mb-4",
}: {
  id: string;
  title: string;
  description: string | null;
  startsAt: Date;
  location: string | null;
  coverUrl: string | null;
  footerSlot?: React.ReactNode;
  statusBadge?: React.ReactNode;
  fullContent?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const cover = coverUrl
    ? { backgroundImage: `url(${coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "linear-gradient(180deg, #f3c3a2 0%, #d98c80 100%)" };
  const date = new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: compact ? "short" : "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(startsAt);
  return (
    <article
      className={`card flex h-full flex-col overflow-hidden ${className}`}
    >
      <div
        className={`flex items-start justify-between gap-2 ${
          compact ? "px-3 pt-2" : "px-4 pt-3"
        }`}
      >
        <span className="rounded-pill bg-brand-pink/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand-pink sm:px-3 sm:text-[10px]">
          Podujatie
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          {statusBadge}
          <span className="text-[9px] font-medium text-brand-purple/60 sm:text-[10px]">
            {date}
          </span>
        </span>
      </div>
      <div
        className={`mt-2 w-full ${compact ? "aspect-[4/3]" : "aspect-[5/3]"}`}
        style={cover}
      />
      <div
        className={`flex flex-1 flex-col ${compact ? "px-3 py-2" : "px-4 py-3"}`}
      >
        <h3
          className={`font-bold text-brand-purple ${
            compact ? "line-clamp-2 text-xs" : "text-sm"
          }`}
        >
          {title}
        </h3>
        {description && (
          <p
            className={`mt-1 text-brand-purple/70 ${
              compact || !fullContent
                ? "line-clamp-2 text-[11px] leading-snug"
                : "text-xs leading-relaxed"
            }`}
          >
            {description}
          </p>
        )}
        {location && (
          <p
            className={`mt-1 text-brand-purple/60 ${
              compact ? "line-clamp-1 text-[10px]" : "text-[11px]"
            }`}
          >
            {location}
          </p>
        )}
        {!footerSlot && (
          <div className="mt-3 flex justify-end">
            <Link
              href={`/home/events/${id}`}
              className="rounded-pill bg-brand-purple px-4 py-1.5 text-xs font-semibold text-white"
            >
              Zaregistrovať sa
            </Link>
          </div>
        )}
      </div>

      {footerSlot}
    </article>
  );
}
