import Link from "next/link";

export function ForumSubHeader({
  backHref,
  title,
  showPlus,
}: {
  backHref: string;
  title?: string;
  showPlus?: boolean;
}) {
  return (
    <header className="flex items-center justify-between px-5 pb-2 pt-3">
      <div className="flex items-center gap-2">
        <Link
          href={backHref}
          aria-label="Späť"
          className="grid h-10 w-10 place-items-center rounded-full text-brand-purple"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        {showPlus && (
          <span className="grid h-10 w-10 place-items-center rounded-full text-brand-purple">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </div>

      {title && (
        <h1 className="flex-1 truncate text-center text-sm font-semibold text-brand-purple">
          {title}
        </h1>
      )}

      <div className="flex items-center gap-2">
        <Link
          href="/home/search"
          aria-label="Hľadať"
          className="grid h-10 w-10 place-items-center rounded-full bg-brand-pink-soft text-black"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M21 21l-4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
        <Link
          href="/menu"
          aria-label="Menu"
          className="grid h-10 w-10 place-items-center rounded-full bg-brand-pink-soft text-black"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
