import Link from "next/link";

export function FeedHeader({ name = "Jana Nováková" }: { name?: string }) {
  return (
    <header className="flex items-center justify-between gap-3 px-5 pt-6 pb-3">
      <Link href="/profile" className="flex items-center gap-3">
        <div
          aria-hidden
          className="h-10 w-10 rounded-full bg-brand-purple/20 ring-2 ring-brand-purple/30"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)",
          }}
        />
        <div>
          <p className="text-sm font-semibold text-brand-purple">{name}</p>
          <p className="text-[11px] text-brand-purple/60">Vitajte späť</p>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifikácie"
          className="grid h-9 w-9 place-items-center rounded-full bg-brand-purple/10 text-brand-purple"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5L6 16zM10 20a2 2 0 004 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </button>
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
