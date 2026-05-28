import Link from "next/link";
import type { PostType } from "@prisma/client";

export function PostCard({
  href,
  type,
  title,
  excerpt,
  coverUrl,
}: {
  href: string;
  type: PostType;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
}) {
  const bg =
    coverUrl ??
    (type === "VIDEO"
      ? "linear-gradient(180deg, #f3c3a2 0%, #d98c80 100%)"
      : type === "ARTICLE"
        ? "linear-gradient(180deg, #f5e0c8 0%, #d8a079 100%)"
        : "linear-gradient(180deg, #ffcdb2 0%, #e07a5f 100%)");
  const coverStyle = coverUrl
    ? { backgroundImage: `url(${coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: bg };

  return (
    <article className="card mx-4 mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="rounded-pill bg-brand-purple/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-purple">
          {kindLabel(type)}
        </span>
      </div>

      <div className="mt-3 aspect-[5/4] w-full" style={coverStyle} />

      <div className="px-4 py-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-brand-purple">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-1 line-clamp-2 text-xs text-brand-purple/70">
            {excerpt}
          </p>
        )}
        <div className="mt-3 flex items-center justify-end">
          <Link
            href={href}
            className="rounded-pill bg-brand-pink px-4 py-1.5 text-xs font-semibold text-white"
          >
            {type === "VIDEO"
              ? "Pozrieť"
              : type === "RECIPE"
                ? "Recept"
                : "Prečítať"}
          </Link>
        </div>
      </div>
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
}: {
  id: string;
  title: string;
  description: string | null;
  startsAt: Date;
  location: string | null;
  coverUrl: string | null;
}) {
  const cover = coverUrl
    ? { backgroundImage: `url(${coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "linear-gradient(180deg, #f3c3a2 0%, #d98c80 100%)" };
  const date = new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(startsAt);
  return (
    <article className="card mx-4 mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="rounded-pill bg-brand-pink/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-pink">
          Podujatie
        </span>
        <span className="text-[10px] font-medium text-brand-purple/60">
          {date}
        </span>
      </div>
      <div className="mt-3 aspect-[5/3] w-full" style={cover} />
      <div className="px-4 py-3">
        <h3 className="text-sm font-bold text-brand-purple">{title}</h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs text-brand-purple/70">
            {description}
          </p>
        )}
        {location && (
          <p className="mt-1 text-[11px] text-brand-purple/60">{location}</p>
        )}
        <div className="mt-3 flex justify-end">
          <Link
            href={`/home/events/${id}`}
            className="rounded-pill bg-brand-purple px-4 py-1.5 text-xs font-semibold text-white"
          >
            Zaregistrovať sa
          </Link>
        </div>
      </div>
    </article>
  );
}

function kindLabel(type: PostType) {
  switch (type) {
    case "VIDEO":
      return "Video";
    case "ARTICLE":
      return "Článok";
    case "RECIPE":
      return "Recept";
  }
}
