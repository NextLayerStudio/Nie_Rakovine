import Link from "next/link";

export function FeedHeader({
  name,
  unreadCount = 0,
}: {
  name: string;
  unreadCount?: number;
}) {
  return (
    <header className="px-5 pb-2 pt-4 font-sans">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/profile"
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <div
            aria-hidden
            className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center ring-2 ring-brand-purple/15"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #b8c0c4 0%, #6f2380 100%)",
            }}
          />
          <div className="min-w-0">
            <p className="text-sm leading-none text-brand-pink">Ahoj!</p>
            <p className="mt-1 truncate text-[22px] font-bold leading-tight text-black">
              {name}
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/home/notifications"
            aria-label="Notifikácie"
            className="relative grid h-11 w-11 place-items-center rounded-full bg-brand-pink-soft text-black"
          >
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-pink px-1 text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5L6 16zM10 20a2 2 0 004 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <Link
            href="/menu"
            aria-label="Menu"
            className="grid h-11 w-11 place-items-center rounded-full bg-brand-pink-soft text-black"
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
      </div>
    </header>
  );
}

export function FeedTabs({
  active = "videos",
}: {
  active?: "videos" | "articles" | "recipes";
}) {
  const tabs = [
    { id: "videos" as const, label: "Videá", href: "/home" },
    { id: "articles" as const, label: "Články", href: "/home/articles" },
    { id: "recipes" as const, label: "Recepty", href: "/home/recipes" },
  ];
  return (
    <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto px-5 pb-3">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`pill-tab whitespace-nowrap transition ${
              isActive
                ? "bg-brand-purple text-white"
                : "bg-brand-pink-soft/60 text-brand-purple"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
