import Link from "next/link";
import { forumAvatarStyle } from "@/lib/avatar-style";

export function ForumDetailHeader({
  backHref,
  imageUrl,
  accentColor,
  title,
  newPostHref,
}: {
  backHref: string;
  imageUrl: string | null;
  accentColor: string | null;
  title: string;
  newPostHref?: string;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-purple/[0.06] bg-white/90 px-5 pb-3 pt-3 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Link href={backHref} aria-label="Späť" className="forum-header-btn">
          <BackIcon />
        </Link>
        {newPostHref && (
          <Link
            href={newPostHref}
            aria-label="Nový príspevok"
            className="forum-header-btn bg-brand-pink text-white ring-brand-pink/20 hover:bg-brand-pink hover:brightness-105"
          >
            <PlusIcon />
          </Link>
        )}
      </div>

      <div
        aria-label={title}
        className="h-11 w-11 shrink-0 rounded-2xl bg-cover bg-center ring-2 ring-white shadow-sm"
        style={{
          ...forumAvatarStyle({ imageUrl, accentColor }),
          boxShadow: `0 4px 14px ${accentColor ?? "#6F2380"}33`,
        }}
      />

      <div className="flex items-center gap-2">
        <Link
          href="/home/forums/search"
          aria-label="Hľadať"
          className="forum-header-btn"
        >
          <SearchIcon />
        </Link>
        <Link href="/menu" aria-label="Menu" className="forum-header-btn">
          <MenuIcon />
        </Link>
      </div>
    </header>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 21l-4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
