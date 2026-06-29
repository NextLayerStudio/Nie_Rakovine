import Image from "next/image";
import Link from "next/link";
import { PhoneShell } from "@/components/PhoneShell";

// "Vitajte v ONKO KLUBE" success screen.
export default function DonePage() {
  return (
    <PhoneShell className="!bg-brand-pink">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 justify-center px-8 pt-10">
          <Image
            src="/logo/Nie_Rakovine_logo.webp"
            alt="NIE RAKOVINE, o.z."
            width={400}
            height={200}
            priority
            className="h-auto w-[150px] object-contain brightness-0 invert"
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center text-white">
          <Image
            src="/logo/logo_biele_onkoklub.png.webp"
            alt="ONKO KLUB"
            width={800}
            height={400}
            priority
            className="h-auto w-[min(54vw,210px)] object-contain"
          />
          <p className="mt-8 max-w-[28ch] text-lg leading-relaxed text-white/90">
            Vaša registrácia bola úspešná. Tešíme sa, že ste sa stali súčasťou
            komunity ONKO KLUB.
          </p>
        </div>

        <div className="flex items-center justify-center px-8 pb-10">
          <Link
            href="/home?setupAvatar=1"
            className="w-[94%] max-w-sm rounded-pill bg-white px-8 py-3.5 text-center text-base font-bold text-brand-purple shadow-soft transition hover:brightness-105 active:scale-[0.99]"
          >
            Pokračovať
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}
