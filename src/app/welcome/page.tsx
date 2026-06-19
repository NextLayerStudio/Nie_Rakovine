import Link from "next/link";
import { NieRakovineMark, OnkoLogo } from "@/components/OnkoLogo";
import { PhoneShell } from "@/components/PhoneShell";

/** Welcome / landing — layout per design mockup (white screen, logos, two CTAs). */
export default function WelcomePage() {
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col bg-white px-8 pt-12 pb-10">
        <div className="flex justify-center">
          <NieRakovineMark priority />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <OnkoLogo size="lg" priority />
        </div>

        <p className="mb-6 text-center text-lg leading-relaxed text-brand-purple/80">
          Miesto podpory a porozumenia na ceste s onkologickým ochorením.
        </p>

        <div className="flex flex-col gap-3">
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
    </PhoneShell>
  );
}
