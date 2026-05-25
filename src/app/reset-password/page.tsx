import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";

// Password change (Zmena hesla)
export default function ResetPasswordPage() {
  return (
    <PhoneShell>
      <TopBar backHref="/login" />

      <div className="px-6">
        <h1 className="text-2xl font-bold text-brand-purple">Zmena hesla</h1>
        <p className="mt-1 text-xs text-brand-purple/60">
          Nastavte si nové heslo
        </p>
      </div>

      <form action="/login" className="mt-6 flex flex-1 flex-col gap-4 px-6">
        <div>
          <label className="label" htmlFor="password">
            Heslo
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Nové heslo"
            className="input-light"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="label" htmlFor="confirmPassword">
            Potvrdiť heslo
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Potvrdiť heslo"
            className="input-light"
            autoComplete="new-password"
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button type="submit" className="btn-secondary w-56">
            Vytvoriť nové heslo
          </button>
        </div>
      </form>

      <div className="h-10" />
    </PhoneShell>
  );
}
