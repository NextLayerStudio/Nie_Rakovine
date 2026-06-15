import Link from "next/link";
import type { PostType } from "@prisma/client";

export function FeedPostItem({
  href,
  type,
  title,
  excerpt,
  coverUrl,
  likeSlot,
}: {
  href: string;
  type: PostType;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  likeSlot?: React.ReactNode;
}) {
  const bg =
    coverUrl ??
    (type === "VIDEO"
      ? "linear-gradient(180deg, #f3c3a2 0%, #d98c80 100%)"
      : type === "ARTICLE"
        ? "linear-gradient(180deg, #f5e0c8 0%, #d8a079 100%)"
        : "linear-gradient(180deg, #ffcdb2 0%, #e07a5f 100%)");
  const coverStyle = coverUrl
    ? {
        backgroundImage: `url(${coverUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : { background: bg };

  return (
    <article className="border-b border-brand-purple/10">
      <Link href={href} className="relative block w-full">
        <div
          className="aspect-[4/3] max-h-[220px] w-full bg-cover bg-center"
          style={coverStyle}
        />
        {type === "VIDEO" && (
          <>
            <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-purple shadow-soft">
              <PlayIcon />
            </span>
            <span className="absolute bottom-4 left-4 rounded-full bg-[#2a9d8f] px-4 py-2 text-xs font-semibold text-white">
              Pozrieť celé video ›
            </span>
            <span className="absolute bottom-4 right-4 text-white">
              <VolumeIcon />
            </span>
          </>
        )}
      </Link>

      <div className="flex items-center gap-4 px-4 py-2.5">
        {likeSlot}
        <Link href={href} aria-label="Komentáre" className="text-brand-purple/80">
          <CommentIcon />
        </Link>
        <span className="flex flex-1 justify-center gap-1" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-purple/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-purple/25" />
        </span>
        <span aria-hidden className="text-brand-purple/80">
          <BookmarkIcon />
        </span>
      </div>

      <div className="px-4 pb-4">
        <Link href={href}>
          <h3 className="text-sm font-semibold text-brand-purple">{title}</h3>
          {excerpt && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-brand-purple/70">
              {excerpt}
            </p>
          )}
        </Link>
      </div>
    </article>
  );
}

export function FeedEventItem({
  id,
  title,
  description,
  startsAt,
  location,
  coverUrl,
}: {
  id: string;
  title: string;
  description: string | null;
  startsAt: Date;
  location: string | null;
  coverUrl: string | null;
}) {
  const cover = coverUrl
    ? {
        backgroundImage: `url(${coverUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : { background: "linear-gradient(180deg, #f3c3a2 0%, #d98c80 100%)" };
  const date = new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(startsAt);

  return (
    <article className="border-b border-brand-purple/10">
      <Link href={`/home/events/${id}`} className="relative block w-full">
        <div
          className="aspect-[4/3] max-h-[220px] w-full bg-cover bg-center"
          style={cover}
        />
        <span className="absolute right-4 top-4 rounded-pill bg-white/90 px-3 py-1 text-[10px] font-medium text-brand-purple/70">
          {date}
        </span>
      </Link>

      <div className="flex items-center justify-end px-4 py-2.5">
        <Link
          href={`/home/events/${id}`}
          className="rounded-pill bg-brand-purple px-4 py-1.5 text-xs font-semibold text-white"
        >
          Zaregistrovať sa
        </Link>
      </div>

      <div className="px-4 pb-4">
        <Link href={`/home/events/${id}`}>
          <h3 className="text-sm font-semibold text-brand-purple">{title}</h3>
          {description && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-brand-purple/70">
              {description}
            </p>
          )}
          {location && (
            <p className="mt-1 text-[11px] text-brand-purple/60">{location}</p>
          )}
        </Link>
      </div>
    </article>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M11 5 6 9H3v6h3l5 4V5zM15.5 12A3.5 3.5 0 0014 8.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M4 12a7 7 0 0112-4.95A7 7 0 0118 20H9l-4 3 1-4A7 7 0 014 12z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M6 4h12v16l-6-4-6 4V4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
