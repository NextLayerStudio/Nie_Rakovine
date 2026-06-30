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
    <nav className="flex items-center gap-0.5 text-sm font-medium">
      {items.map(({ href, label }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded px-3 py-1.5 text-xs transition",
              active
                ? "bg-white/20 text-white font-semibold"
                : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            {label}
            {href === "/admin/forums" && pendingCount > 0 && (
              <span className="ml-1.5 rounded bg-brand-pink px-1.5 py-0.5 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
