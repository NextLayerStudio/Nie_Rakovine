import Link from "next/link";
import { NieRakovineMark, OnkoLogo } from "@/components/OnkoLogo";
import { PhoneShell } from "@/components/PhoneShell";

/** Welcome / landing — layout per design mockup (white screen, logos, two CTAs). */
export default function WelcomePage() {
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
        <header className="flex shrink-0 justify-center px-6 pt-8 pb-3">
          <NieRakovineMark priority />
        </header>

        <div className="flex shrink-0 flex-col items-center px-8 py-4">
          <OnkoLogo size="lg" priority />
        </div>

        <div className="mt-auto flex shrink-0 flex-col items-center gap-4 px-8 pb-8 pt-2">
          <p className="max-w-[300px] text-center text-xs leading-relaxed text-brand-purple/70">
            uvodne slovo ktore sme uz napisali tisickrat
          </p>

          <div className="flex w-full max-w-[300px] flex-col items-stretch gap-3">
            <Link
              href="/login"
              className="rounded-pill bg-brand-pink py-3.5 text-center text-sm font-bold text-white shadow-soft transition hover:brightness-105 active:scale-[0.99]"
            >
              Prihlásiť sa
            </Link>
            <Link
              href="/register"
              className="rounded-pill bg-brand-pink-register py-3.5 text-center text-sm font-bold text-white shadow-soft transition hover:brightness-105 active:scale-[0.99]"
            >
              Registrovať sa
            </Link>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
