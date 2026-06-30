import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Mic, Headphones, BookOpen, Circle, Play, User } from "lucide-react";

const TOPICS = [
  "Výživa počas chemoterapie a po nej",
  "Zvládanie úzkosti a strachu z relapsu",
  "Pohyb a fyzioterapia pre onkopacientov",
  "Právne poradenstvo — práva pacienta",
  "Sociálne dávky a invalidný dôchodok",
  "Lymfedém — prevencia a každodenná starostlivosť",
  "Intimita a sexualita počas liečby",
  "Návrat do práce po onkologickej liečbe",
  "Paliatívna starostlivosť a podpora blízkych",
  "Onkogenetika — dedičné predispozície k rakovine",
];

const PILLARS = [
  { icon: Mic,        accent: "#FDA4C7", title: "Živé prednášky",        desc: "Pravidelné online aj offline prednášky s odborníkmi. Môžeš sa pýtať, diskutovať a dostať odpovede priamo od špecialistu." },
  { icon: Headphones, accent: "#6F2380", title: "Podcasty s odborníkmi", desc: "Séria rozhovorov s ľuďmi, ktorí sa onkológii venujú každý deň. Počúvaj kedykoľvek — v práci, pri varení, na prechádzke." },
  { icon: BookOpen,   accent: "#FDA4C7", title: "Archív pre teba",       desc: "Každá prednáška a každý podcast zostane v knižnici. Ak nestihneš živé vysielanie, nič nestratíš." },
];

const UKAZKY = [
  { img: "[IMG-27]", title: "Výživa počas chemoterapie",       host: "Nutričná poradkyňa",   dur: "48 min", type: "Prednáška" },
  { img: "[IMG-03]", title: "Ako zvládnuť úzkosť pri diagnóze", host: "Mirka Malejčíková",    dur: "35 min", type: "Podcast" },
  { img: "[IMG-04]", title: "Fyzioterapia po operácii",         host: "Fyzioterapeut Ondrej", dur: "42 min", type: "Prednáška" },
  { img: "[IMG-05]", title: "Právne minimum pre pacienta",      host: "JUDr. Marta Kováčová", dur: "55 min", type: "Prednáška" },
];

export default function PrenasakyPodcastyPage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">
            <div>
              <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">Zadarmo pre všetkých členov</p>
              <h1 className="text-[2.4rem] md:text-[3.2rem] font-black text-[#6F2380] leading-[1.1] mb-5">
                Odborníci,
                <br />
                ktorým môžeš veriť.
              </h1>
              <p className="text-[#6F2380]/70 text-base leading-relaxed mb-8">
                V OnkoKlube pravidelne organizujeme odborné prednášky a nahrávame podcasty
                s lekármi, psychológmi, fyzioterapeutmi a ďalšími špecialistami.
                Živé aj v archíve — všetko máš ako člen zadarmo.
              </p>
              <Link
                href="/register"
                className="block w-full md:w-auto md:inline-block rounded-full bg-[#FDA4C7] text-white text-base font-black py-4 md:px-10 text-center"
              >
                Chcem prístup k prednáškam
              </Link>
            </div>
            {/* Screenshot — viditeľný len na desktop */}
            <div className="hidden md:block">
              <div className="w-full aspect-video rounded-[2rem] bg-[#6F2380]/20 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#FDA4C7]/40 flex items-center justify-center">
                  <Play size={20} className="text-[#FDA4C7] ml-0.5" fill="currentColor" />
                </div>
                <p className="text-[#6F2380]/30 text-xs font-semibold">[IMG-27] Screenshot prednášky v platforme</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot — len mobile */}
      <section className="px-5 pb-14 md:hidden">
        <div className="w-full aspect-video rounded-[2rem] bg-[#6F2380]/20 flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#FDA4C7]/40 flex items-center justify-center">
            <Play size={20} className="text-[#FDA4C7] ml-0.5" fill="currentColor" />
          </div>
          <p className="text-[#6F2380]/30 text-xs font-semibold">[IMG-27] Screenshot prednášky v platforme</p>
        </div>
      </section>

      {/* 3 piliere */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col gap-3 md:grid md:grid-cols-3">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-[#FDA4C7]/15 md:flex-col">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: p.accent }}>
                    <Icon size={18} className="text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-black text-[#6F2380] text-[15px] leading-tight mb-1">{p.title}</h3>
                    <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ukážky z archívu */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-xl font-black text-[#6F2380] mb-5">Ukážka z archívu</h2>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            {UKAZKY.map((v, i) => (
              <div key={v.title} className="bg-white rounded-2xl overflow-hidden border border-[#FDA4C7]/15">
                <div
                  className="w-full aspect-video flex items-center justify-center relative"
                  style={{ backgroundColor: i % 2 === 0 ? "#FDA4C7" + "18" : "#6F2380" + "12" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: i % 2 === 0 ? "#FDA4C7" : "#6F2380" }}
                  >
                    <Play size={16} className="text-white ml-0.5" fill="white" />
                  </div>
                  <div className="absolute top-2 left-2 bg-black/20 rounded-full px-2 py-0.5">
                    <span className="text-white text-[10px] font-bold">{v.type}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/30 rounded-full px-2 py-0.5">
                    <span className="text-white text-[10px]">{v.dur}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-black text-[#6F2380] text-[14px] mb-1">{v.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#FDA4C7]/20 flex items-center justify-center">
                      <User size={10} className="text-[#FDA4C7]" />
                    </div>
                    <p className="text-[#6F2380]/45 text-[12px]">{v.host}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[#6F2380]/40 text-sm text-center mt-5">
            A desiatky ďalších prednášok a podcastov čakajú v archíve.
          </p>
        </div>
      </section>

      {/* Témy */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-xl font-black text-[#6F2380] mb-6">Témy prednášok a podcastov</h2>
          <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
            {TOPICS.map((topic) => (
              <div key={topic} className="flex items-center gap-3">
                <Circle size={7} className="text-[#FDA4C7] shrink-0 fill-[#FDA4C7]" />
                <p className="text-[#6F2380]/75 text-sm">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot podcastu */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="aspect-square rounded-2xl bg-[#6F2380]/15 flex items-center justify-center">
              <p className="text-[#6F2380]/25 text-[10px] font-semibold text-center px-2">[IMG] Screenshot podcastu</p>
            </div>
            <div className="aspect-square rounded-2xl bg-[#FDA4C7]/15 flex items-center justify-center">
              <p className="text-[#FDA4C7]/40 text-[10px] font-semibold text-center px-2">[IMG] Prednáška live</p>
            </div>
            <div className="hidden md:flex aspect-square rounded-2xl bg-[#6F2380]/10 items-center justify-center">
              <p className="text-[#6F2380]/25 text-[10px] font-semibold text-center px-2">[IMG] Archív prednášok</p>
            </div>
            <div className="hidden md:flex aspect-square rounded-2xl bg-[#FDA4C7]/10 items-center justify-center">
              <p className="text-[#FDA4C7]/30 text-[10px] font-semibold text-center px-2">[IMG] Podcast detail</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="rounded-[1.8rem] bg-[#6F2380] p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Prvá prednáška ťa čaká.</h2>
            <p className="text-white/65 text-sm leading-relaxed mb-6 md:max-w-sm md:mx-auto">
              Zaregistruj sa a okamžite získaš prístup k celému archívu.
            </p>
            <Link href="/register" className="inline-block rounded-full bg-[#FDA4C7] text-white font-black text-base px-10 py-4">
              Chcem sa zapojiť
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
