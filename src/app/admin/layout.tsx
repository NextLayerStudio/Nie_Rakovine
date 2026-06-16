import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/statistics", label: "Štatistiky" },
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

  const [pendingForums, pendingThreads] = await Promise.all([
    prisma.forum.count({
      where: { published: false, createdById: { not: null } },
    }),
    prisma.forumThread.count({ where: { status: "PENDING" } }),
  ]);
  const pendingCount = pendingForums + pendingThreads;

  return (
    <div className="min-h-[100dvh] bg-[#f7f4f6] text-brand-purple">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-brand-purple to-[#7d2a90] text-white shadow-soft">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-base font-extrabold tracking-wide"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/15 text-sm">
                OK
              </span>
              <span className="hidden sm:inline">ONKO KLUB · Admin</span>
            </Link>
          </div>

          <AdminNav items={NAV} pendingCount={pendingCount} />

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden text-white/70 lg:inline">{user.email}</span>
            <Link
              href="/home"
              className="rounded-pill bg-white px-3 py-1.5 font-bold text-brand-purple transition hover:brightness-95"
            >
              Aplikácia
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-pill border border-white/40 px-3 py-1.5 font-bold transition hover:bg-white/10"
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
