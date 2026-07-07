import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CalendarDays } from "lucide-react";

export default function PodujatiaPage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#FDA4C7]/15 flex items-center justify-center">
            <CalendarDays size={28} className="text-[#FDA4C7]" strokeWidth={2} />
          </div>
          <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">Podujatia</p>
          <h1 className="text-[2rem] md:text-[2.6rem] font-black text-[#6F2380] leading-[1.15] mb-4">
            Táto stránka sa pripravuje
          </h1>
          <p className="text-[#6F2380]/70 text-base leading-relaxed">
            Čoskoro tu nájdete prehľad podujatí ONKO KLUBU. Ďakujeme za trpezlivosť.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
