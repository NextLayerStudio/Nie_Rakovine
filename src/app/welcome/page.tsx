import Link from "next/link";
import { NieRakovineMark, OnkoLogo } from "@/components/OnkoLogo";
import { PhoneShell } from "@/components/PhoneShell";

/** Welcome / landing — layout per design mockup (white screen, logos, two CTAs). */
export default function WelcomePage() {
  return (
    <PhoneShell>
      <div className="flex min-h-[100dvh] flex-col bg-white sm:min-h-0">
        <header className="flex justify-center px-6 pt-10 pb-4">
          <NieRakovineMark priority />
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-8 py-6">
          <OnkoLogo size="xl" priority />
        </div>

        <div className="flex flex-col items-center gap-5 px-8 pb-12 pt-2">
          <p className="max-w-[280px] text-center text-[11px] leading-relaxed text-brand-purple/70">
            uvodne slovo ktore sme uz napisali tisickrat
          </p>

          <div className="flex w-full max-w-[280px] flex-col items-stretch gap-3">
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
