import Link from "next/link";
import { NieRakovineMark, OnkoLogo } from "@/components/OnkoLogo";
import { PhoneShell } from "@/components/PhoneShell";

// Welcome screen (2). Matches reference: white background, NIE RAKOVINE mark
// at the top, big ONKO KLUB logo centred, tiny intro line, two pink CTAs.
export default function WelcomePage() {
  return (
    <PhoneShell>
      <div className="flex justify-center px-6 pt-8">
        <NieRakovineMark />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <OnkoLogo size="md" />
      </div>

      <div className="flex flex-col items-center gap-4 px-8 pb-10">
        <p className="text-center text-[11px] text-brand-purple/60">
          uvodne slovo ktore sme uz napisali tisickrat
        </p>
        <div className="flex w-full flex-col items-center gap-3">
          <Link
            href="/login"
            className="w-64 rounded-pill border border-brand-pink bg-brand-pink-soft py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-brand-pink"
          >
            Prihlásiť sa
          </Link>
          <Link
            href="/register"
            className="w-64 rounded-pill border border-brand-pink bg-brand-pink-soft py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-brand-pink"
          >
            Registrovať sa
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}
