import Link from "next/link";

export function ForumDetailHeader({
  backHref,
  imageUrl: _imageUrl,
  accentColor: _accentColor,
  title: _title,
  newPostHref,
}: {
  backHref: string;
  imageUrl: string | null;
  accentColor: string | null;
  title: string;
  newPostHref?: string;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-purple/[0.06] bg-white/90 px-4 pb-3 pt-3 backdrop-blur-md">
      <Link href={backHref} aria-label="Späť" className="forum-header-btn">
        <BackIcon />
      </Link>

      {newPostHref ? (
        <Link
          href={newPostHref}
          className="flex items-center gap-1.5 rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
        >
          <PlusIcon />
          Nový príspevok
        </Link>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-2">
        <Link href="/home/forums/search" aria-label="Hľadať" className="forum-header-btn">
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
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
