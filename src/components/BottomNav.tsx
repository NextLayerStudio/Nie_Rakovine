"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Domov", icon: HomeIcon },
  { href: "/home/forums", label: "Fóra", icon: ForumIcon },
  { href: "/home/search", label: "Hľadať", icon: SearchIcon },
  { href: "/home/calendar", label: "Aktivity", icon: CalendarIcon },
];

/** Hide nav on forum thread chat so the comment bar has full focus. */
function isForumThreadChat(pathname: string | null): boolean {
  if (!pathname) return false;
  const match = pathname.match(/^\/home\/forums\/([^/]+)\/([^/]+)$/);
  if (!match) return false;
  return match[2] !== "new";
}

/** Full-screen menu hub — bottom tabs would overlap the menu panel. */
function isMenuHub(pathname: string | null): boolean {
  return pathname === "/menu";
}

export function BottomNav() {
  const pathname = usePathname();

  if (isForumThreadChat(pathname) || isMenuHub(pathname)) return null;

  return (
    <nav
      className="bottom-nav pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pt-2"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="pointer-events-auto mx-auto grid h-[54px] w-full max-w-[390px] grid-cols-4 items-center rounded-full bg-brand-pink px-2 shadow-soft">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/home"
              ? pathname === "/home"
              : pathname === href || pathname?.startsWith(`${href}/`);

          return (
            <li key={href} className="flex justify-center">
              <Link
                href={href}
                aria-label={label}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full text-white transition",
                  active ? "bg-white/20" : "hover:bg-white/10",
                )}
              >
                <Icon />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const iconClass = "h-[30px] w-[30px]";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <path
        d="M5 11.5 12 5l7 6.5V19a1.5 1.5 0 01-1.5 1.5H15v-5.5H9V20.5H6.5A1.5 1.5 0 015 19v-7.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Fóra — speech bubble with dots (not notifications). */
function ForumIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <path
        d="M6 9.5a5.5 5.5 0 0110.4-1.8A4.5 4.5 0 0119 12c0 2.4-2 4.3-4.5 4.3H12l-3.8 2.8V16.5A5.5 5.5 0 016 9.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="11.5" r="0.9" fill="currentColor" />
      <circle cx="12" cy="11.5" r="0.9" fill="currentColor" />
      <circle cx="15" cy="11.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M15.8 15.8 20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
      <rect
        x="4"
        y="5.5"
        width="16"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M4 9.5h16M8 4v2.5M16 4v2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 12.5h2v2h-2zM13.5 12.5h2v2h-2z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}
