import Image from "next/image";

// Minimal footer for the public events flow (/podujatia). No links into the
// rest of the app (login/register/pricing/...) — only contact info and the
// legally required business details, as plain text.
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
        <a href="mailto:office@nierakovine.sk" className="text-[#FDA4C7] text-sm font-semibold block mb-1">
          office@nierakovine.sk
        </a>
        <a href="tel:+421911843336" className="text-white/65 text-sm block">
          +421 911 843 336
        </a>

        <div className="h-px bg-white/10 my-5" />

        <p className="text-white/30 text-[11px]">NIE RAKOVINE, o. z. · IČO: 50654896 · Cukrová 2272/14, Bratislava</p>
        <p className="text-white/30 text-[11px] mt-1">© 2026 NIE RAKOVINE, o. z. · Vytvorené v spolupráci s NextLayer Studio</p>
      </div>
    </footer>
  );
}
