import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Leaf, Brain, Apple, MessageCircle, Stethoscope, Heart } from "lucide-react";

const CATEGORIES = [
  { icon: Leaf,          accent: "#FDA4C7", title: "Joga a pohyb",           desc: "Jemné cvičenia špeciálne prispôsobené pre onkologických pacientov. Od 10-minútových ranných cvičení až po hodinové lekcie." },
  { icon: Brain,         accent: "#6F2380", title: "Mindfulness a psychika",  desc: "Meditácie, dýchacie techniky a mindfulness prax pre zvládanie stresu, úzkosti a emočnej záťaže počas liečby." },
  { icon: Apple,         accent: "#FDA4C7", title: "Výživa a jedlo",          desc: "Čo jesť počas chemoterapie, ako zvládnuť nevoľnosť, aké potraviny posilňujú imunitu. Rady od overených nutričných poradkýň." },
  { icon: MessageCircle, accent: "#6F2380", title: "Psychologická podpora",   desc: "Rozhovory, prednášky a techniky od psychológov, ktorí pracujú s onkologickými pacientmi každý deň." },
  { icon: Stethoscope,   accent: "#FDA4C7", title: "Liečba a diagnóza",       desc: "Zrozumiteľné vysvetlenia typov liečby, nežiaducich účinkov a toho, čo môžeš očakávať v jednotlivých fázach." },
  { icon: Heart,         accent: "#6F2380", title: "Rodina a vzťahy",         desc: "Ako hovoriť s deťmi o chorobe, ako zvládnuť záťaž pre blízkych a ako udržiavať vzťahy počas liečby." },
];

export default function KontentKniznicaPage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      <section className="pt-24 pb-10 px-5">
        <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
          Kontent knižnica
        </p>
        <h1 className="text-[2.4rem] font-black text-[#6F2380] leading-[1.1] mb-5 max-w-xs">
          Stovky videí. Vždy po ruke.
        </h1>
        <p className="text-[#6F2380]/70 text-base leading-relaxed mb-8 max-w-sm">
          V knižnici OnkoKlubu nájdeš videá od overených odborníkov — joga, mindfulness,
          výživa, psychika, prednášky o liečbe. Pozri si ich kedykoľvek, odkiaľkoľvek,
          podľa seba. Žiadny tlak — obsah na teba čaká vtedy, keď ty chceš.
        </p>
        <Link
          href="/register"
          className="block w-full rounded-full bg-[#FDA4C7] text-white text-xl font-black py-5 text-center"
        >
          Chcem prístup ku knižnici
        </Link>
      </section>

      <section className="px-5 pb-14">
        <div className="w-full aspect-video rounded-[1.8rem] bg-[#6F2380]/20" />
      </section>

      <section className="px-5 pb-16">
        <h2 className="text-2xl font-black text-[#6F2380] mb-6">Čo v knižnici nájdeš</h2>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.title} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#FDA4C7]/15">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cat.accent }}>
                  <Icon size={18} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-black text-[#6F2380] text-[15px] leading-tight mb-0.5">{cat.title}</h3>
                  <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 pb-16">
        <div className="rounded-[1.8rem] bg-[#6F2380] p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Začni pozerať ešte dnes.</h2>
          <p className="text-white/65 text-sm leading-relaxed mb-6">
            Obsah je prístupný okamžite po registrácii. Žiadne čakanie, žiadny schvaľovací proces.
          </p>
          <Link href="/register" className="inline-block rounded-full bg-[#FDA4C7] text-white font-black text-base px-8 py-4">
            Chcem sa zapojiť
          </Link>
        </div>
      </section>

      <footer className="px-5 pb-10 text-center text-[#6F2380]/40 text-xs">
        <Link href="/" className="underline">← Späť na úvod</Link>
      </footer>
    </main>
  );
}
