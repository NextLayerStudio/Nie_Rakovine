import Link from "next/link";

const NAV = [
  { label: "Čo získaš",            href: "/co-ziskas" },
  { label: "Prednášky & Podcasty", href: "/prednasky-podcasty" },
  { label: "Eventy",               href: "/akcie" },
  { label: "Sponzori a zľavy",     href: "/sponzori" },
  { label: "Cenník",               href: "/cennik" },
  { label: "Prihlásiť sa",         href: "/login" },
  { label: "Registrácia",          href: "/register" },
];

export function Footer() {
  return (
    <footer className="bg-[#6F2380]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-8">
        {/* Desktop: 3 stĺpce, Mobile: stacked */}
        <div className="md:grid md:grid-cols-3 md:gap-12 mb-8">
          {/* Logo */}
          <div className="mb-7 md:mb-0">
            <p className="font-black text-2xl mb-2">
              <span className="text-white">ONKO</span>
              <span className="text-[#FDA4C7]">KLUB</span>
            </p>
            <p className="text-white/50 text-xs leading-relaxed">
              Platforma pre onkologických pacientov a ich blízkych.
              <br />
              Prevádzkuje: NIE RAKOVINE, o. z.
            </p>
          </div>

          {/* Navigácia */}
          <div className="mb-7 md:mb-0">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3">Navigácia</p>
            <div className="flex flex-col gap-1.5">
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} className="text-white/65 text-sm hover:text-white transition-colors w-fit">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3">Kontakt</p>
            <a href="mailto:office@nierakovine.sk" className="text-[#FDA4C7] text-sm font-semibold block mb-1">
              office@nierakovine.sk
            </a>
            <a href="https://nierakovine.sk" target="_blank" rel="noopener noreferrer" className="text-white/50 text-sm block mb-6">
              nierakovine.sk
            </a>
            <Link href="/register" className="inline-block rounded-full bg-[#FDA4C7] text-white text-sm font-black px-6 py-3">
              Registrácia
            </Link>
          </div>
        </div>

        {/* Delič */}
        <div className="h-px bg-white/10 mb-5" />

        {/* Spodná lišta */}
        <div className="md:flex md:items-center md:justify-between text-white/30 text-[11px]">
          <div className="mb-3 md:mb-0">
            <p>NIE RAKOVINE, o. z. · IČO: 50654896 · Cukrová 2272/14, Bratislava</p>
            <p className="mt-1">© 2026 NIE RAKOVINE, o. z. · Vytvorené v spolupráci s NextLayer Studio</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link href="/ochrana-sukromia" className="underline hover:text-white/60 transition-colors">Ochrana súkromia</Link>
            <Link href="/podmienky" className="underline hover:text-white/60 transition-colors">Podmienky</Link>
            <Link href="/kontakt" className="underline hover:text-white/60 transition-colors">Kontakt</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
