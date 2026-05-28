import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { PhoneShell } from "@/components/PhoneShell";
import { requireUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

const MAIN_ITEMS = [
  { href: "/menu/zdravotna-karta", label: "Moja zdravotná karta", icon: "card" },
  { href: "/menu/cvicenie", label: "Cvičenie", icon: "yoga" },
  { href: "/profile", label: "Môj profil", icon: "user" },
  { href: "/menu/kontakt-lekar", label: "Kontakt na lekára", icon: "doctor" },
  { href: "/menu/zlavy", label: "Zľavy", icon: "tag" },
  { href: "/menu/aktivity", label: "Aktivity", icon: "activity" },
  { href: "/menu/clenovia", label: "Členov", icon: "users" },
  { href: "/menu/informacie", label: "Informácie", icon: "info" },
  { href: "/menu/nastavenia", label: "Nastavenia", icon: "settings" },
];

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  return (
    <PhoneShell>
      <div className="flex flex-1 flex-col overflow-y-auto bg-brand-pink text-white">
        <header className="flex items-center justify-between px-5 pt-6 pb-4">
          <Link href="/profile" className="flex items-center gap-3">
            <div
              aria-hidden
              className="h-10 w-10 rounded-full bg-white/30 ring-2 ring-white/50"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 0%, #f7d5e0 100%)",
              }}
            />
            <div>
              <p className="text-sm font-semibold">{user.fullName}</p>
              <p className="text-[11px] text-white/80">
                {isAdmin ? "Administrátor" : "Členka ONKO KLUBU"}
              </p>
            </div>
          </Link>
          <Link
            href="/home"
            aria-label="Zatvoriť"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/20"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </header>

        <nav className="px-3 pb-4">
          <ul className="flex flex-col gap-1">
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-4 rounded-2xl bg-white/20 px-4 py-3 text-sm font-semibold hover:bg-white/30"
                >
                  <MenuIcon name="settings" />
                  <span>Administrácia</span>
                  <span className="ml-auto text-white/70">›</span>
                </Link>
              </li>
            )}
            {MAIN_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium hover:bg-white/15"
                >
                  <MenuIcon name={item.icon} />
                  <span>{item.label}</span>
                  <span className="ml-auto text-white/70">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto px-5 pb-6">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-pill bg-white py-3 text-sm font-semibold text-brand-purple"
            >
              Odhlásiť sa
            </button>
          </form>
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}

function MenuIcon({ name }: { name: string }) {
  const path: Record<string, React.ReactNode> = {
    card: <path d="M3 7h18v10H3z M3 11h18" />,
    yoga: <path d="M12 3a3 3 0 100 6 3 3 0 000-6zm-6 18l6-7 6 7" />,
    user: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" />,
    doctor: <path d="M12 3v10m0 0a4 4 0 11-4 4m4-4a4 4 0 104 4M8 7h8" />,
    tag: <path d="M3 12V3h9l9 9-9 9-9-9z M7 7l.01 0" />,
    activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
    users: <path d="M16 11a4 4 0 100-8 4 4 0 000 8zm-8 0a3 3 0 100-6 3 3 0 000 6zM2 20a6 6 0 0112 0M14 14a6 6 0 016 6" />,
    info: <path d="M12 9v6 M12 5h.01 M12 21a9 9 0 100-18 9 9 0 000 18z" />,
    settings: <path d="M12 9a3 3 0 100 6 3 3 0 000-6z M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 00-2-1.2L14 3h-4l-.5 2.6a7 7 0 00-2 1.2l-2.4-1-2 3.5 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7 7 0 002 1.2L10 21h4l.5-2.6a7 7 0 002-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z" />,
  };
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {path[name]}
      </svg>
    </span>
  );
}
