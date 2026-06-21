import Link from "next/link";
import { OnkoLogo } from "@/components/OnkoLogo";
import { PhoneShell } from "@/components/PhoneShell";

// "Vitajte v ONKO KLUBE" success screen.
export default function DonePage() {
  return (
    <PhoneShell className="!bg-brand-pink">
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center text-white">
        <h1 className="text-4xl font-extrabold tracking-tight">Vitajte</h1>
        <div className="mt-10">
          <OnkoLogo size="md" />
        </div>
        <p className="mt-8 max-w-[24ch] text-sm leading-relaxed text-white/90">
          Vaša registrácia bola úspešná. Tešíme sa, že ste sa stali súčasťou
          komunity ONKO KLUB.
        </p>
      </div>

      <div className="flex items-center justify-center pb-10">
        <Link
          href="/home?setupAvatar=1"
          className="rounded-pill bg-white px-8 py-3 text-sm font-bold text-brand-purple shadow-soft hover:brightness-105"
        >
          Pokračovať
        </Link>
      </div>
    </PhoneShell>
  );
}
