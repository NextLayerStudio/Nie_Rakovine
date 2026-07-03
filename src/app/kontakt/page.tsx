import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      <section className="pt-24 pb-10 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
            Kontakt
          </p>
          <h1 className="text-[2.2rem] md:text-[2.8rem] font-black text-[#6F2380] leading-[1.1] mb-4">
            Sme tu, ak nás potrebujete
          </h1>
          <p className="text-[#6F2380]/70 text-base leading-relaxed max-w-xl">
            Máte otázku k členstvu, platbe alebo obsahu ONKO KLUBU? Napíšte
            nám alebo zavolajte — ozveme sa vám čo najskôr.
          </p>
        </div>
      </section>

      <section className="pb-16 px-5">
        <div className="max-w-3xl mx-auto grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:office@nierakovine.sk"
            className="flex items-start gap-4 rounded-3xl bg-white p-6 border border-[#FDA4C7]/15 hover:border-[#FDA4C7]/40 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FDA4C7]/15 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-[#FDA4C7]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">E-mail</p>
              <p className="text-[#6F2380] font-bold text-[15px]">office@nierakovine.sk</p>
            </div>
          </a>

          <a
            href="tel:+421911843336"
            className="flex items-start gap-4 rounded-3xl bg-white p-6 border border-[#FDA4C7]/15 hover:border-[#FDA4C7]/40 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-[#6F2380]/15 flex items-center justify-center shrink-0">
              <Phone size={18} className="text-[#6F2380]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Telefón</p>
              <p className="text-[#6F2380] font-bold text-[15px]">+421 911 843 336</p>
            </div>
          </a>

          <div className="flex items-start gap-4 rounded-3xl bg-white p-6 border border-[#FDA4C7]/15">
            <div className="w-11 h-11 rounded-xl bg-[#FDA4C7]/15 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-[#FDA4C7]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Sídlo</p>
              <p className="text-[#6F2380] font-bold text-[15px] leading-snug">
                Cukrová 2272/14
                <br />
                811 01 Bratislava-Staré Mesto
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-3xl bg-white p-6 border border-[#FDA4C7]/15">
            <div className="w-11 h-11 rounded-xl bg-[#6F2380]/15 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-[#6F2380]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Fakturačné údaje</p>
              <p className="text-[#6F2380] font-bold text-[15px] leading-snug">
                NIE RAKOVINE, o. z.
                <br />
                IČO: 50654896 · DIČ: 2120693707
                <br />
                IČ DPH: SK2120693707
              </p>
            </div>
          </div>
        </div>

        <p className="max-w-3xl mx-auto mt-6 text-[#6F2380]/50 text-sm">
          Viac o tom, ako spracúvame vaše otázky a údaje, nájdete v{" "}
          <Link href="/podmienky" className="underline font-semibold">
            obchodných podmienkach
          </Link>{" "}
          a v sekcii{" "}
          <Link href="/ochrana-sukromia" className="underline font-semibold">
            ochrana súkromia
          </Link>
          .
        </p>
      </section>

      <Footer />
    </main>
  );
}
