import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  Play, Mic, MapPin, MessageSquare, Tag, QrCode, Smile, BookOpen,
  Check, ChevronRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Play,
    accent: "#FDA4C7",
    slug: "kontent-kniznica",
    title: "Videoknižnica",
    headline: "Stovky videí. Vždy po ruke.",
    desc: "Joga, mindfulness, dýchacie cvičenia, prednášky o liečbe, výžive aj psychike. Videá od overených odborníkov — pozri si ich z gauča, z postele, z kdekoľvek. Kedykoľvek chceš, bez tlaku.",
    detailItems: ["Jemná joga pre onkopacientov", "Mindfulness a meditácia", "Dýchacie cvičenia", "Výživa počas chemoterapie", "Psychologická podpora", "Prednášky o liečbe"],
    imgs: ["[IMG-02] Joga video thumbnail", "[IMG-03] Mindfulness video", "[IMG-26] Screenshot knižnice"],
  },
  {
    icon: Mic,
    accent: "#6F2380",
    slug: "prednasky-podcasty",
    title: "Prednášky & Podcasty",
    headline: "Odborníci, ktorým môžeš veriť.",
    desc: "Pravidelné odborné prednášky a podcasty s lekármi, psychológmi, fyzioterapeutmi a ďalšími špecialistami. Živé aj v archíve — všetko máš ako člen zadarmo.",
    detailItems: ["Živé online prednášky", "Podcasty s odborníkmi", "Archív pre teba", "Otázky priamo odborníkovi", "Upozornenia na nové epizódy"],
    imgs: ["[IMG-27] Screenshot podcastu", "[IMG-03] Prednáška live"],
  },
  {
    icon: MapPin,
    accent: "#FDA4C7",
    slug: "akcie",
    title: "Eventy po Slovensku",
    headline: "Stretni sa s nami vo tvojom meste.",
    desc: "Workshopy, stretnutia a akcie sa konajú pravidelne v Bratislave, Nitre, Košiciach, Poprade a ďalších mestách. Rezervuj si miesto jedným kliknutím — pre členov zadarmo.",
    detailItems: ["Joga workshopy", "Mindfulness skupiny", "Odborné stretnutia s lekármi", "Komunity meetupy", "SMS pripomienka 24h vopred"],
    imgs: ["[IMG-29] Kalendár eventov", "[IMG-04] Workshop foto"],
  },
  {
    icon: MessageSquare,
    accent: "#6F2380",
    slug: "onkorumky",
    title: "Onkorumky — fóra",
    headline: "Komunita, ktorá rozumie bez slov.",
    desc: "29 tematických fór kde môžeš písať anonymne alebo pod vlastným menom. Témy od konkrétnych diagnóz až po každodenný život, rodinu a návrat do práce. Bezpečné, moderované prostredie.",
    detailItems: ["29 tematických fór", "Anonymné príspevky", "Podľa diagnózy, témy aj liečby", "Moderované prostredie", "Zábleskový pohľad bez registrácie"],
    imgs: ["[IMG-28] Screenshot fóra", "[IMG-05] Detail vlákna"],
  },
  {
    icon: Tag,
    accent: "#FDA4C7",
    slug: "sponzori",
    title: "Exkluzívne zľavy",
    headline: "Stovky eur ušetrených ročne.",
    desc: "Desiatky partnerských značiek z oblasti zdravia, výživy, pohybu a každodenného života ti pripravili špeciálne zľavy. Len pre členov OnkoKlubu — ukážeš OKkartu, dostaneš zľavu.",
    detailItems: ["Zdravie a starostlivosť", "Výživa a doplnky", "Psychická pohoda", "Šport a pohyb", "Každodenný život"],
    imgs: ["[IMG-30] Screenshot zliav", "[IMG-09] Partneri"],
  },
  {
    icon: QrCode,
    accent: "#6F2380",
    slug: "sponzori",
    title: "OKkarta",
    headline: "Jeden QR kód — desiatky výhod.",
    desc: "Digitálna členská karta s unikátnym QR kódom — tvoj preukaz člena. Uplatníš ňou zľavy u partnerských značiek a vstúpiš na eventy. Vždy v telefóne, žiadna tlač.",
    detailItems: ["Automaticky po registrácii", "Unikátny QR kód", "Uplatnenie zliav", "Vstup na eventy", "Doklad o členstve"],
    imgs: ["[IMG-24] Mockup OKkarty na telefóne"],
  },
  {
    icon: Smile,
    accent: "#FDA4C7",
    slug: null,
    title: "Mood Meter",
    headline: "Sleduj svoju pohodu každý deň.",
    desc: "Každý deň zaznač ako sa cítiš. Ak ti je dlhodobo zle, OnkoKlub ti odporučí odborníka. Tvoje záznamy sú súkromné — nevidí ich nikto iný.",
    detailItems: ["Denná evidencia nálady", "Súkromné záznamy", "Odporúčanie odborníka", "Prehľad trendov"],
    imgs: ["[IMG] Screenshot Mood Meter"],
  },
  {
    icon: BookOpen,
    accent: "#6F2380",
    slug: null,
    title: "Sociálny kompas",
    headline: "Vieme, že to nie je len o zdraví.",
    desc: "Prehľadné informácie o právach pacienta, invalidnom dôchodku, PN, príspevkoch a sociálnej pomoci. Nestrácaj čas v byrokratickom bludisku — máme to prehľadne za teba.",
    detailItems: ["Práva pacienta", "Invalidný dôchodok", "PN a pracovná neschopnosť", "Príspevky a dávky", "Návrat do práce", "Sociálna pomoc"],
    imgs: ["[IMG] Screenshot Sociálneho kompasu"],
  },
];

export default function CoZiskasPage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">
            <div>
              <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">Čo získaš</p>
              <h1 className="text-[2.4rem] md:text-[3.2rem] font-black text-[#6F2380] leading-[1.1] mb-5">
                Všetko, čo potrebuješ.
                <br />
                Na jednom mieste.
              </h1>
              <p className="text-[#6F2380]/70 text-base leading-relaxed mb-8">
                OnkoKlub nie je len platforma — je to celý ekosystém podpory pre onkologických
                pacientov a ich blízkych. Pozri sa, čo na teba čaká.
              </p>
              <div className="md:flex md:gap-3">
                <Link
                  href="/register"
                  className="block w-full md:w-auto md:inline-block rounded-full bg-[#FDA4C7] text-white text-base font-black py-4 md:px-8 text-center mb-3 md:mb-0"
                >
                  Chcem sa zapojiť
                </Link>
                <Link
                  href="/cennik"
                  className="block w-full md:w-auto md:inline-block rounded-full border-2 border-[#FDA4C7] text-[#FDA4C7] text-base font-black py-4 md:px-8 text-center"
                >
                  Pozrieť cenník
                </Link>
              </div>
            </div>
            {/* Dashboard placeholder */}
            <div className="hidden md:block">
              <div className="w-full aspect-video rounded-[1.8rem] bg-[#6F2380]/20 flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#6F2380]/30 flex items-center justify-center">
                  <Play size={20} className="text-[#6F2380]/50 ml-0.5" />
                </div>
                <p className="text-[#6F2380]/30 text-xs font-semibold">[IMG-25] Dashboard platformy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Veľký screenshot — len mobile */}
      <section className="px-5 pb-14 md:hidden">
        <div className="w-full aspect-video rounded-[1.8rem] bg-[#6F2380]/20 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#6F2380]/30 flex items-center justify-center">
            <Play size={20} className="text-[#6F2380]/50 ml-0.5" />
          </div>
          <p className="text-[#6F2380]/30 text-xs font-semibold">[IMG-25] Dashboard platformy</p>
        </div>
      </section>

      {/* Features */}
      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-x-14 md:gap-y-16">
            {FEATURES.map((f, fi) => {
              const Icon = f.icon;
              const isEven = fi % 2 === 0;
              return (
                <div key={f.title} className="pb-14 md:pb-0 border-b border-[#FDA4C7]/15 md:border-0 last:border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: f.accent }}
                    >
                      <Icon size={18} className="text-white" strokeWidth={2} />
                    </div>
                    <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider">{f.title}</p>
                  </div>
                  <h2 className="text-[1.8rem] font-black text-[#6F2380] leading-[1.15] mb-3">{f.headline}</h2>
                  <p className="text-[#6F2380]/65 text-[15px] leading-relaxed mb-6">{f.desc}</p>

                  {/* Screenshot placeholdery */}
                  <div className="flex flex-col gap-3 mb-6">
                    {f.imgs.length === 1 ? (
                      <div
                        className="w-full aspect-video rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: (isEven ? "#FDA4C7" : "#6F2380") + "18" }}
                      >
                        <p className="text-xs font-semibold text-center px-4" style={{ color: (isEven ? "#FDA4C7" : "#6F2380") + "60" }}>
                          {f.imgs[0]}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div
                          className="w-full aspect-video rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: f.accent + "18" }}
                        >
                          <p className="text-xs font-semibold px-4 text-center" style={{ color: f.accent + "70" }}>{f.imgs[0]}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {f.imgs.slice(1).map((img) => (
                            <div
                              key={img}
                              className="aspect-square rounded-2xl flex items-center justify-center p-2"
                              style={{ backgroundColor: (isEven ? "#6F2380" : "#FDA4C7") + "12" }}
                            >
                              <p className="text-[10px] font-semibold text-center leading-tight" style={{ color: (isEven ? "#6F2380" : "#FDA4C7") + "60" }}>
                                {img}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mb-5">
                    {f.detailItems.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: f.accent + "25" }}>
                          <Check size={11} strokeWidth={3} style={{ color: f.accent }} />
                        </div>
                        <span className="text-[#6F2380]/70 text-[14px]">{item}</span>
                      </div>
                    ))}
                  </div>

                  {f.slug && (
                    <Link
                      href={`/${f.slug}`}
                      className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-[#FDA4C7]/20 active:scale-[0.98] transition-transform md:inline-flex md:gap-3 md:rounded-full md:border-2 md:border-[#FDA4C7] md:px-6 md:py-3"
                    >
                      <span className="text-[#6F2380] font-bold text-sm">Zistiť viac o {f.title}</span>
                      <ChevronRight size={18} className="text-[#FDA4C7]" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Záverečné CTA */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="rounded-[2rem] bg-[#6F2380] px-6 py-10 text-center md:py-14">
            <h2 className="text-[2rem] md:text-[2.4rem] font-black text-white leading-tight mb-3">Pripravený začať?</h2>
            <p className="text-white/65 text-sm leading-relaxed mb-7 md:max-w-md md:mx-auto">
              Registrácia trvá 2 minúty. Členstvo od 5 € / mesiac, zruší sa kedykoľvek.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-full bg-[#FDA4C7] text-white font-black text-base px-10 py-4"
            >
              Chcem sa zapojiť
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
