import Link from "next/link";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";

// Registration - "Nový účet"
export default function RegisterPage() {
  return (
    <PhoneShell>
      <TopBar backHref="/welcome" />

      <div className="px-6">
        <h1 className="text-2xl font-bold text-brand-purple">Nový účet</h1>
      </div>

      <form
        action="/register/subscription"
        className="mt-4 flex flex-1 flex-col gap-3 px-6"
      >
        <div>
          <label className="label" htmlFor="fullName">
            Celé meno
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Jana Nováková"
            className="input-light"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email
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
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="label" htmlFor="confirmPassword">
            Potvrdenie hesla
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="input-light"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="label" htmlFor="birthDate">
            Dátum narodenia
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            className="input-light"
          />
        </div>

        <div className="mt-4 flex flex-col items-center gap-3">
          <button type="submit" className="btn-secondary w-56">
            Registrovať sa
          </button>
          <p className="text-center text-[11px] leading-relaxed text-brand-purple/60">
            Registráciou súhlasíte s našimi{" "}
            <Link href="#" className="font-semibold text-brand-purple">
              podmienkami
            </Link>
            .
          </p>
        </div>
      </form>

      <div className="h-8" />
    </PhoneShell>
  );
}
