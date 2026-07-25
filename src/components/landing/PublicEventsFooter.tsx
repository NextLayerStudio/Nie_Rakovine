import Image from "next/image";
import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Podmienky používania", href: "/podmienky" },
  { label: "Obchodné podmienky", href: "/obchodne-podmienky" },
  { label: "Zásady ochrany osobných údajov", href: "/ochrana-sukromia" },
  { label: "Pravidlá komunity", href: "/pravidla-komunity" },
  { label: "Právne vyhlásenie o zodpovednosti", href: "/pravne-vyhlasenie" },
  { label: "Zásady používania súborov cookies", href: "/cookies" },
  { label: "Kontakt", href: "/kontakt" },
];

// Minimal footer for the public events flow (/podujatia). No links into the
// rest of the app (login/register/pricing/...) — only contact info, the
// legally required business details and the legal sub-pages.
export function PublicEventsFooter() {
  return (
    <footer className="bg-[#6F2380]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-8">
        <Image
          src="/images/logo-horizontal.png"
          alt="OnkoKlub"
          width={160}
          height={55}
          className="h-9 w-auto mb-3 brightness-0 invert"
        />
        <p className="text-white/50 text-xs leading-relaxed mb-4">
          Platforma pre onkologických pacientov a ich blízkych.
        </p>

        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2">Kontakt</p>
        <a href="mailto:office@onkoklub.sk" className="text-[#FDA4C7] text-sm font-semibold block mb-1">
          office@onkoklub.sk
        </a>
        <a href="tel:+421904701009" className="text-white/65 text-sm block">
          +421 904 701 009
        </a>

        <div className="h-px bg-white/10 my-5" />

        <p className="text-white/30 text-[11px]">NIE RAKOVINE, o. z. · IČO: 50654896 · Cukrová 2272/14, Bratislava</p>
        <p className="text-white/30 text-[11px] mt-1">© 2026 NIE RAKOVINE, o. z. · Vytvorené v spolupráci s NextLayer Studio</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {LEGAL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/30 text-[11px] underline transition-colors hover:text-white/60"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
