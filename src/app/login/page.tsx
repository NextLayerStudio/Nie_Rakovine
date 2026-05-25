import Link from "next/link";
import { NieRakovineMark, OnkoLogo } from "@/components/OnkoLogo";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";

// Login (Prihlásenie).
export default function LoginPage() {
  return (
    <PhoneShell>
      <TopBar backHref="/welcome" />

      <div className="px-6">
        <h1 className="text-2xl font-bold text-brand-purple">Prihlásenie</h1>
        <p className="mt-1 text-xs text-brand-purple/60">Ďalší krok</p>
      </div>

      <form
        action="/home"
        className="mt-6 flex flex-1 flex-col gap-4 px-6"
      >
        <div>
          <label className="label" htmlFor="email">
            Email alebo telefónne číslo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="meno@email.sk"
            className="input-light"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Heslo
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="input-light"
            autoComplete="current-password"
          />
        </div>

        <div className="mt-4 flex flex-col items-center gap-3">
          <button type="submit" className="btn-secondary w-56">
            Prihlásiť sa
          </button>
          <Link
            href="/reset-password"
            className="text-xs font-medium text-brand-purple/70 hover:text-brand-purple"
          >
            Zabudli ste heslo?
          </Link>
        </div>

        <p className="mt-2 text-center text-[11px] text-brand-purple/60">
          Nemáte účet?{" "}
          <Link href="/register" className="font-semibold text-brand-purple">
            Registrujte sa
          </Link>
        </p>
      </form>

      <div className="flex items-end justify-between gap-4 px-6 pb-8 pt-4">
        <OnkoLogo showWordmark={false} className="!flex-row" />
        <NieRakovineMark variant="color" />
      </div>
    </PhoneShell>
  );
}
