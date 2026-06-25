import Link from "next/link";
import { NieRakovineLogo, OnkoLogo } from "@/components/OnkoLogo";
import { PhoneShell } from "@/components/PhoneShell";

/** Welcome / landing — layout per design mockup (white screen, logos, two CTAs). */
export default function WelcomePage() {
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col bg-white">
        <div className="welcome-top flex shrink-0 justify-center px-8">
          <NieRakovineLogo priority className="w-[150px]" />
        </div>

        <div className="flex flex-1 items-center justify-center px-8">
          <OnkoLogo
            size="2xl"
            priority
            className="welcome-logo max-h-[560px] w-auto"
          />
        </div>

        <div
          className="welcome-bottom shrink-0 px-8"
          style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom))" }}
        >
          <p className="mb-5 text-center text-base leading-relaxed text-brand-purple/80">
            Miesto podpory a porozumenia na ceste s onkologickým ochorením.
          </p>

          <div className="welcome-buttons flex w-full flex-col gap-3">
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
