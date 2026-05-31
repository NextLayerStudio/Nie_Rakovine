import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profiles", label: "Profily" },
  { href: "/admin/forums", label: "Fóra" },
  { href: "/admin/users", label: "Používatelia" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  const pendingCount =
    (await prisma.forumThread.count({ where: { status: "PENDING" } })) +
    (await prisma.forumComment.count({ where: { status: "PENDING" } }));

  return (
    <div className="min-h-[100dvh] bg-white text-brand-purple">
      <header className="border-b border-brand-purple/10 bg-brand-purple text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link href="/admin" className="text-lg font-extrabold tracking-wide">
            ONKO KLUB · Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:underline">
                {label}
                {href === "/admin/forums" && pendingCount > 0 && (
                  <span className="ml-1 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-brand-purple">
                    {pendingCount}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/admin/forums/moderation"
              className="rounded-pill border border-white/40 px-2 py-0.5 text-xs hover:bg-white/10"
            >
              Schvaľovanie
              {pendingCount > 0 ? ` (${pendingCount})` : ""}
            </Link>
          </nav>
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden text-white/70 sm:inline">{user.email}</span>
            <Link
              href="/home"
              className="rounded-pill bg-white px-3 py-1 font-bold text-brand-purple"
            >
              Aplikácia
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-pill border border-white/40 px-3 py-1 font-bold"
              >
                Odhlásiť
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
