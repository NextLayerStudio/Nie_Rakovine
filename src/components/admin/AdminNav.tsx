"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function AdminNav({
  items,
  pendingCount,
}: {
  items: NavItem[];
  pendingCount: number;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm font-medium">
      {items.map(({ href, label }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-pill px-3.5 py-1.5 transition",
              active
                ? "bg-white text-brand-purple shadow-soft"
                : "text-white/85 hover:bg-white/10 hover:text-white",
            )}
          >
            {label}
            {href === "/admin/forums" && pendingCount > 0 && (
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  active
                    ? "bg-brand-pink text-white"
                    : "bg-white text-brand-purple",
                )}
              >
                {pendingCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
