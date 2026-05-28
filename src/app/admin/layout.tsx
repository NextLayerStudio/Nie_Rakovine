import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-[100dvh] bg-white text-brand-purple">
      <header className="border-b border-brand-purple/10 bg-brand-purple text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-extrabold tracking-wide">
            ONKO KLUB · Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/events" className="hover:underline">
              Podujatia
            </Link>
            <Link href="/admin/posts" className="hover:underline">
              Obsah
            </Link>
            <Link href="/admin/users" className="hover:underline">
              Používatelia
            </Link>
            <span className="hidden text-xs text-white/70 sm:inline">
              {user.email}
            </span>
            <Link
              href="/home"
              className="rounded-pill bg-white px-3 py-1 text-xs font-bold text-brand-purple"
            >
              Aplikácia
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-pill border border-white/40 px-3 py-1 text-xs font-bold"
              >
                Odhlásiť
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
