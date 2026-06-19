import Link from "next/link";
import { NieRakovineMark, OnkoLogo } from "@/components/OnkoLogo";
import { PhoneShell } from "@/components/PhoneShell";

/** Welcome / landing — layout per design mockup (white screen, logos, two CTAs). */
export default function WelcomePage() {
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
        <div className="welcome-content flex flex-col items-center px-8 pb-12">
          <NieRakovineMark priority />

          <OnkoLogo size="lg" priority className="max-h-[300px] w-auto mt-4" />

          <p className="text-center text-lg leading-relaxed text-brand-purple/80 -mt-2 relative z-10">
            Miesto podpory a porozumenia na ceste s onkologickým ochorením.
          </p>

          <div className="w-full flex flex-col gap-3 mt-4 relative z-10">
            <Link
              href="/login"
              className="rounded-pill bg-brand-pink py-5 text-center text-xl font-bold text-white shadow-soft transition hover:brightness-105 active:scale-[0.99]"
            >
              Prihlásiť sa
            </Link>
            <Link
              href="/register"
              className="rounded-pill bg-brand-pink-register py-5 text-center text-xl font-bold text-white shadow-soft transition hover:brightness-105 active:scale-[0.99]"
            >
              Registrovať sa
            </Link>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
