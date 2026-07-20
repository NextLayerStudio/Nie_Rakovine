import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LiabilityDisclaimerContent } from "@/components/legal/LiabilityDisclaimerContent";

export default function PravneVyhlaseniePage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      <section className="pt-24 pb-6 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
            Právne informácie
          </p>
          <h1 className="text-[2.2rem] md:text-[2.8rem] font-black text-[#6F2380] leading-[1.1] mb-3">
            Právne vyhlásenie o zodpovednosti
          </h1>
          <p className="text-[#6F2380]/60 text-sm">Posledná aktualizácia: júl 2026</p>
        </div>
      </section>

      <section className="pb-20 px-5">
        <div className="max-w-3xl mx-auto rounded-[2rem] bg-white p-6 md:p-10 border border-[#FDA4C7]/15">
          <LiabilityDisclaimerContent className="text-[15px] leading-relaxed text-[#6F2380]/80" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
