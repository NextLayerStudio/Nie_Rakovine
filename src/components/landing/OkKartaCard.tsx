import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

/** Vizuál OK Karty — presne rovnaký dizajn ako reálna OK Karta v aplikácii. */
export function OkKartaCard() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[24px]"
      style={{
        aspectRatio: "1.72",
        background: "linear-gradient(135deg, #1a0430 0%, #5a1880 60%, #28074a 100%)",
        boxShadow: "0 12px 40px rgba(90,24,128,0.5), 0 2px 8px rgba(0,0,0,0.35)",
      }}
    >
      {/* dekoratívne kruhy */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#FDA4C7]/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex h-full flex-col px-5 pb-4 pt-4">
        {/* hlavička s logami */}
        <div className="flex items-center justify-between">
          <Image
            src="/logo/onkoklub-horizontal.png"
            alt="ONKO KLUB"
            width={1642}
            height={538}
            className="h-[18px] w-auto brightness-0 invert opacity-85"
          />
          <Image
            src="/logo/nie-rakovine.png"
            alt="NIE RAKOVINE, o.z."
            width={1626}
            height={851}
            className="h-[14px] w-auto brightness-0 invert opacity-40"
          />
        </div>

        {/* obsah */}
        <div className="mt-3 flex flex-1 items-center gap-3">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#CA6A8A]/80 to-[#6F2380] text-xl font-bold text-white ring-2 ring-white/25">
            TM
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-[17px] font-bold leading-tight text-white">
              Tvoje meno
            </h4>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-[3px] text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-400/25">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Aktívny člen
            </div>
          </div>

          <div className="shrink-0 overflow-hidden rounded-xl bg-white p-[5px] shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
            <QRCodeSVG value="OK-00000000" size={56} fgColor="#28074a" bgColor="#ffffff" level="M" />
          </div>
        </div>

        {/* pätička — číslo člena */}
        <div className="mt-2 border-t border-white/10 pt-2">
          <p className="font-mono text-[10px] tracking-widest text-white/35">
            OK · 0000 · 0000
          </p>
        </div>
      </div>
    </div>
  );
}
