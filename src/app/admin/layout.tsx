import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { getPendingModerationCounts } from "@/lib/admin-metrics";
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
  const { total: pendingCount } = await getPendingModerationCounts();

  return (
    <div className="min-h-[100dvh] bg-[#f5f6f8] text-brand-purple">
      <header className="sticky top-0 z-30 border-b border-brand-purple/20 bg-brand-purple text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-2.5">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 text-sm font-bold tracking-wide"
          >
            <span className="grid h-7 w-7 place-items-center rounded bg-white/15 text-xs font-extrabold">
              OK
            </span>
            <span className="hidden opacity-90 sm:inline">ONKO KLUB · Admin</span>
          </Link>

          <AdminNav items={NAV} pendingCount={pendingCount} />

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden text-white/55 lg:inline">{user.email}</span>
            <Link
              href="/home"
              className="rounded-md bg-white/15 px-3 py-1.5 font-semibold transition hover:bg-white/25"
            >
              Aplikácia
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-white/25 px-3 py-1.5 font-semibold transition hover:bg-white/10"
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
