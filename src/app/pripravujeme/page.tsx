import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { OnkoLogo } from "@/components/OnkoLogo";

export default function PripravujemePage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      <section className="flex flex-col items-center justify-center px-5 pt-32 pb-24 text-center">
        <OnkoLogo size="lg" priority className="mb-8" />

        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#FDA4C7]">
          ONKO KLUB
        </p>
        <h1 className="mb-4 max-w-lg text-[2rem] md:text-[2.6rem] font-black leading-[1.15] text-[#6F2380]">
          Pripravujeme pre vás ONKO KLUB
        </h1>
        <p className="mb-8 max-w-md text-base leading-relaxed text-[#6F2380]/70">
          Pre viac informácií sledujte naše sociálne siete.
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-[#6F2380]/50">
          ONKO KLUB ešte nie je vo finálnej verzii — usilovne na ňom pracujeme,
          aby sme vám priniesli čo najlepší zážitok. Ďakujeme za trpezlivosť.
        </p>
      </section>

      <Footer />
    </main>
  );
}
