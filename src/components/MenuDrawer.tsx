"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";

const MAIN_ITEMS = [
  { href: "/home/notifications", label: "Oznámenia", icon: "bell" as const },
  { href: "/profile", label: "Môj profil", icon: "user" as const },
  { href: "/home/saved", label: "Uložené", icon: "bookmark" as const },
  { href: "/home/kniznica", label: "Kontent knižnica", icon: "library" as const },
  { href: "/menu/aktivity", label: "Aktivity", icon: "calendar" as const },
  { href: "/home/forums", label: "Fóra", icon: "forum" as const },
  { href: "/menu/zlavova-karta", label: "Moja zľavová karta", icon: "card" as const },
  { href: "/home/zlavy", label: "Zľavy", icon: "percent" as const },
] as const;

export function MenuDrawer({
  userName,
  avatarUrl,
  isAdmin,
}: {
  userName: string;
  avatarUrl?: string | null;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("open-menu", handler);
    return () => document.removeEventListener("open-menu", handler);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 z-30 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={close}
        aria-hidden
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        aria-hidden={!open}
        className={cn(
          "absolute inset-y-0 right-0 z-40 flex w-[88%] flex-col bg-brand-pink text-white",
          "transform transition-transform duration-300 ease-in-out overflow-y-auto",
          open ? "translate-x-0 visible" : "invisible translate-x-full",
        )}
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between px-5 pt-8 pb-4">
          <Link href="/profile" onClick={close} className="flex items-center gap-3">
            <div
              aria-hidden
              className="h-11 w-11 shrink-0 rounded-full bg-cover bg-center ring-2 ring-white/40"
              style={profileAvatarStyle(avatarUrl)}
            />
            <div>
              <p className="text-sm leading-none text-white/80">Ahoj!</p>
              <p className="mt-1 text-lg font-bold leading-tight">{userName}</p>
            </div>
          </Link>
          <button
            onClick={close}
            aria-label="Zatvoriť"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* Search */}
        <form action="/home/search" className="shrink-0 px-5 pb-4">
          <div className="relative">
            <input
              type="search"
              name="q"
              placeholder="Hľadať"
              className="w-full rounded-pill bg-white py-3 pl-5 pr-12 text-sm text-brand-purple placeholder-brand-purple/50 outline-none"
            />
            <button
              type="submit"
              aria-label="Hľadať"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-purple/60"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <circle cx="10.5" cy="10.5" r="6.2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M15.8 15.8 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </form>

        {/* Nav */}
        <nav className="flex-1 px-3">
          <ul className="flex flex-col gap-0.5">
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  onClick={close}
                  className="flex items-center gap-4 rounded-2xl bg-white/20 px-4 py-3 text-sm font-semibold hover:bg-white/30"
                >
                  <MenuIcon name="settings" />
                  <span>Administrácia</span>
                </Link>
              </li>
            )}
            {MAIN_ITEMS.map((item) => (
              <li key={item.href}>
                {"comingSoon" in item && item.comingSoon ? (
                  <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 opacity-90">
                    <MenuIcon name={item.icon} muted />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-sm font-medium text-white/85">{item.label}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-white/55">Pripravujeme</span>
                    </span>
                    <span className="shrink-0 rounded-pill bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Čoskoro
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/15"
                  >
                    <MenuIcon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Nastavenia + Odhlásiť */}
        <div className="shrink-0 px-3 pt-2">
          <Link
            href="/menu/nastavenia"
            onClick={close}
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium hover:bg-white/15"
          >
            <MenuIcon name="settings" />
            <span>Nastavenia</span>
          </Link>
        </div>

        <div className="shrink-0 px-5 pt-2">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-pill bg-white/15 py-2.5 text-xs font-semibold hover:bg-white/25"
            >
              Odhlásiť sa
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function MenuIcon({ name, muted = false }: { name: string; muted?: boolean }) {
  const path: Record<string, React.ReactNode> = {
    card: (<><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></>),
    bell: (<><path d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5L6 16z" /><path d="M10 20a2 2 0 004 0" /></>),
    user: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" />,
    library: (<><path d="M5 5h6v14H5a2 2 0 01-2-2V7a2 2 0 012-2z" /><path d="M13 5h6v14h-6a2 2 0 01-2-2V7a2 2 0 012-2z" /></>),
    percent: (<><circle cx="7.5" cy="7.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /><path d="M19 5L5 19" /></>),
    calendar: (<><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M4 9.5h16M8 4v2.5M16 4v2.5" /></>),
    forum: (<><path d="M6 9.5a5.5 5.5 0 0110.4-1.8A4.5 4.5 0 0119 12c0 2.4-2 4.3-4.5 4.3H12l-3.8 2.8V16.5A5.5 5.5 0 016 9.5z" /><circle cx="9" cy="11.5" r="0.9" fill="currentColor" stroke="none" /><circle cx="12" cy="11.5" r="0.9" fill="currentColor" stroke="none" /><circle cx="15" cy="11.5" r="0.9" fill="currentColor" stroke="none" /></>),
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinejoin="round" />,
    settings: (<><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" /></>),
  };
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${muted ? "bg-white/10" : "bg-white/20"}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {path[name]}
      </svg>
    </span>
  );
}
