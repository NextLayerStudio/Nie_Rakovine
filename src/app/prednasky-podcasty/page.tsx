import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Mic, Headphones, BookOpen, Circle } from "lucide-react";
import { ExpandableText } from "@/components/landing/ExpandableText";

const TOPICS = [
  "Výživa počas onkologickej liečby a po jej ukončení",
  "Zvládanie úzkosti a strachu z návratu ochorenia",
  "Pohyb, rehabilitácia a fyzioterapia pre onkologických pacientov",
  "Právne poradenstvo a práva pacienta",
  "Sociálna podpora, dávky a invalidný dôchodok",
  "Lymfedém – prevencia a každodenná starostlivosť",
  "Onkogenetika – dedičné faktory ovplyvňujúce vznik rakoviny",
  "Blízkosť a intimita počas onkologickej liečby",
  "Návrat do práce po ukončení liečby",
  "Paliatívna starostlivosť a podpora blízkych",
  "Ako byť oporou človeku s onkologickým ochorením",
  "Psychická podpora a komunikácia s blízkymi počas liečby",
  "Strata blízkeho po onkologickom ochorení – smútenie a vyrovnávanie sa so stratou",
  "Prevencia a včasné odhalenie onkologických ochorení",
];

const PILLARS = [
  { icon: Mic,        accent: "#FDA4C7", title: "Odborné prednášky",            desc: "Pravidelné online aj prezenčné stretnutia s lekármi, psychológmi, fyzioterapeutmi a ďalšími odborníkmi, na ktorých môžete priamo klásť otázky." },
  { icon: Headphones, accent: "#6F2380", title: "Podcasty s odborníkmi",        desc: "Rozhovory s odborníkmi, ktorí sa dlhodobo venujú starostlivosti o onkologických pacientov. Počúvať ich môžete kedykoľvek a bez ďalších poplatkov." },
  { icon: BookOpen,   accent: "#FDA4C7", title: "Archív prednášok a podcastov", desc: "Prednášky a podcasty sú pre členov ONKO KLUBU dostupné v ONKO knižnici bez časového obmedzenia." },
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
              <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">Bezplatne pre všetkých členov</p>
              <h1 className="text-[2.4rem] md:text-[3.2rem] font-black text-[#6F2380] leading-[1.1] mb-5">
                Odborníci a lektori, ktorým môžete dôverovať
              </h1>
              <div className="mb-8">
                <ExpandableText maxHeight={100} fadeColor="#FFF3F9">
                  <p className="text-[#6F2380]/70 text-base leading-relaxed">
                    Pravidelne pripravujeme odborné prednášky, diskusie a podcasty
                    s lekármi, psychológmi, fyzioterapeutmi a ďalšími odborníkmi.
                    Ako člen/ka ONKO KLUBU máte prístup k záznamom aj živým
                    vysielaniam, ktoré sú vám k dispozícii kedykoľvek a bez
                    ďalších poplatkov.
                  </p>
                </ExpandableText>
              </div>
              <Link
                href="/register"
                className="block w-full md:w-auto md:inline-block rounded-full bg-[#FDA4C7] text-white text-base font-black py-4 md:px-10 text-center"
              >
                Chcem prístup k prednáškam
              </Link>
            </div>
            {/* Video — viditeľné len na desktop */}
            <div className="hidden md:block">
              <div className="relative w-full aspect-video overflow-hidden rounded-[2rem]">
                <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
                  <source src="/videos/mirka.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video — len mobile */}
      <section className="px-5 pb-14 md:hidden">
        <div className="relative w-full aspect-video overflow-hidden rounded-[2rem]">
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
            <source src="/videos/mirka.mp4" type="video/mp4" />
          </video>
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
                  <div className="min-w-0">
                    <h3 className="font-black text-[#6F2380] text-[15px] leading-tight mb-1">{p.title}</h3>
                    <ExpandableText maxHeight={56} fadeColor="#FFFFFF">
                      <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{p.desc}</p>
                    </ExpandableText>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Témy */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="relative w-full aspect-video overflow-hidden rounded-[2rem] mb-6">
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
              <source src="/videos/ano-zdraviu-intro.mp4" type="video/mp4" />
            </video>
          </div>
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
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Prednášky a podcasty vždy poruke</h2>
            <p className="text-white/65 text-sm leading-relaxed mb-6 md:max-w-sm md:mx-auto">
              Po registrácii získate okamžitý prístup k prednáškam, podcastom
              a ďalšiemu obsahu pre onkologických pacientov a ich blízkych.
            </p>
            <Link href="/register" className="inline-block rounded-full bg-[#FDA4C7] text-white font-black text-base px-10 py-4">
              Získať prístup
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
