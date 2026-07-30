import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  Play, Mic, MapPin, MessageSquare, Tag, QrCode,
  Check, ChevronRight,
} from "lucide-react";
import { ExpandableText } from "@/components/landing/ExpandableText";

type FeatureImg = { label: string; src?: string; fit?: "cover" | "contain" };

const FEATURES: {
  icon: typeof Play;
  accent: string;
  slug: string | null;
  title: string;
  headline: string;
  desc: string;
  detailItems: string[];
  imgs: FeatureImg[];
  secondaryAspect?: string;
}[] = [
  {
    icon: Play,
    accent: "#FDA4C7",
    slug: "kontent-kniznica",
    title: "ONKO knižnica",
    headline: "Desiatky videí vždy poruke",
    desc: "Joga, mindfulness, jemné pohybové a dychové cvičenia, odborné diskusie o liečbe, výžive aj psychike. ONKO KLUB prináša exkluzívnu ONKO knižnicu vytvorenú špeciálne pre onkologických pacientov a ich blízkych. Sledujte kedykoľvek, kdekoľvek a vo vlastnom tempe.",
    detailItems: ["Jemná joga pre onkologických pacientov", "Mindfulness a meditácia", "Výživa počas chemoterapie", "Psychologická podpora", "Fyzioterapia a rehabilitácia"],
    secondaryAspect: "aspect-video",
    imgs: [
      { label: "Joga video thumbnail", src: "/images/co-ziskas-video-wide.jpg" },
      { label: "Mindfulness video", src: "/images/co-ziskas-video-1.jpg", fit: "contain" },
      { label: "Screenshot knižnice", src: "/images/co-ziskas-video-2.jpg", fit: "contain" },
    ],
  },
  {
    icon: Mic,
    accent: "#6F2380",
    slug: "prednasky-podcasty",
    title: "Prednášky & Podcasty",
    headline: "Odborníci a lektori, ktorým môžete dôverovať",
    desc: "Za každým podcastom a prednáškou stojí konkrétny odborník či lektor s overenými skúsenosťami. Všetky epizódy sú pre členov ONKO KLUBU dostupné bezplatne.",
    detailItems: ["Odborné prednášky online", "Podcasty s odborníkmi na tému pohyb, výživa, genetika, liečba a iné", "Archív pre členov", "Upozornenia na nové epizódy"],
    imgs: [
      { label: "Odborníci a lektori", src: "/images/lektori/viktor-oliva.jpg" },
      { label: "Odborníci a lektori", src: "/images/lektori/malejcikova.jpg" },
    ],
  },
  {
    icon: MapPin,
    accent: "#FDA4C7",
    slug: "akcie",
    title: "Kalendár aktivít",
    headline: "Nezmeškajte podujatie vo vašom okolí",
    desc: "Workshopy, skupinové stretnutia a odborné podujatia sú dostupné vo viacerých regiónoch Slovenska. Ako člen/ka ONKO KLUBU máte možnosť prihlásiť sa na vybrané aktivity jednoducho priamo v aplikácii ONKO KLUB.",
    detailItems: ["Jemná joga pre onkologických pacientov", "Mindfulness – skupinové workshopy", "Odborné stretnutia s lekármi a špecialistami", "Podporné skupinové stretnutia", "SMS pripomienka 24 hodín vopred"],
    imgs: [
      { label: "Kalendár aktivít", src: "/images/co-ziskas-calendar-wide.jpg" },
      { label: "Workshop", src: "/images/co-ziskas-calendar-1.jpg" },
    ],
  },
  {
    icon: MessageSquare,
    accent: "#6F2380",
    slug: "onkorumky",
    title: "Diskusné fóra",
    headline: "Podeľte sa o to, čím prechádzate",
    desc: "Zdieľajte svoje skúsenosti, otázky, obavy či každodenné výzvy s ľuďmi, ktorí vedia, čo prežívate. Môžete prispievať pod vlastným menom alebo anonymne.",
    detailItems: ["Tematické diskusné fóra", "Diskusie rozdelené podľa oblastí záujmu a potrieb", "Možnosť prispievať anonymne alebo pod vlastným menom", "Moderované a bezpečné prostredie", "Ukážka obsahu dostupná aj bez registrácie"],
    imgs: [
      { label: "Fóra", src: "/images/co-ziskas-forum-wide.jpg" },
      { label: "Diskusné fóra", src: "/images/co-ziskas-forum-1.jpg" },
      { label: "Diskusné fóra", src: "/images/co-ziskas-forum-2.jpg" },
    ],
  },
  {
    icon: Tag,
    accent: "#FDA4C7",
    slug: "sponzori",
    title: "Zľavy a benefity",
    headline: "Špeciálne zľavy len pre členov ONKO KLUBU",
    desc: "Ako člen/ka ONKO KLUBU máte vďaka našim partnerom možnosť využiť špeciálne zľavy. Stačí sa preukázať OK Kartou a zľava sa vám automaticky uplatní.",
    detailItems: ["Zdravie a starostlivosť o telo", "Výživa, doplnky a zdravý životný štýl", "Pohyb, rehabilitácia a fyzická aktivita", "Spánok a regenerácia", "Kozmetika a starostlivosť o pokožku", "Technológie pre zdravie", "Voľnočasové aktivity", "Duševná pohoda a relaxácia"],
    imgs: [
      { label: "Naši partneri", src: "/images/co-ziskas-discounts-wide.jpg" },
      { label: "Nadácia SPP", src: "/images/partneri/nadacia-spp.jpg", fit: "contain" },
      { label: "RAJ zdravia", src: "/images/partneri/raj-zdravia.png", fit: "contain" },
    ],
  },
  {
    icon: QrCode,
    accent: "#6F2380",
    slug: "sponzori",
    title: "OK Karta",
    headline: "Jeden QR kód – desiatky výhod",
    desc: "Digitálna členská OK Karta s unikátnym QR kódom slúži ako váš členský preukaz. Umožňuje uplatniť zľavy u partnerských značiek a zároveň slúži ako vstupenka na podujatia a workshopy. Vždy dostupná vo vašom mobile, bez potreby tlačenej verzie.",
    detailItems: ["OK Karta sa vytvorí ihneď po dokončení registrácie", "Každý člen má vlastný identifikátor", "Vstupenka na podujatia a workshopy", "Prehľadný preukaz člena vždy v mobile", "Uplatnenie zliav"],
    imgs: [
      { label: "OK Karta", src: "/images/co-ziskas-okkarta-wide.jpg" },
      { label: "OK Karta", src: "/images/co-ziskas-okkarta-1.jpg" },
      { label: "OK Karta", src: "/images/co-ziskas-okkarta-2.jpg" },
    ],
  },
];

export default function CoZiskasPage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      {/* Hero — screenshot appky ako pozadie */}
      <section className="pb-12 md:pb-20">
        <div className="relative overflow-hidden">
          <Image
            src="/images/co-ziskas-dashboard.jpg"
            alt="ONKO KLUB v aplikácii"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60" />

          <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 pt-24 pb-14 md:pt-32 md:pb-20">
            <div className="max-w-xl">
              <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-3">Čo získate</p>
              <h1 className="text-[2.4rem] md:text-[3.2rem] font-black text-white leading-[1.1] mb-5 [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
                Všetko podstatné na jednom mieste
              </h1>
              <div className="mb-8">
                <p className="text-white/85 text-base leading-relaxed [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
                  ONKO KLUB spája informácie a praktickú pomoc pre onkologických
                  pacientov a ich blízkych. Pozrite sa, čo všetko máte k dispozícii.
                </p>
              </div>
              <div className="md:flex md:gap-3">
                <Link
                  href="/register"
                  className="block w-full md:w-auto md:inline-block rounded-full bg-[#FDA4C7] text-white text-base font-black py-4 md:px-8 text-center mb-3 md:mb-0 shadow-lg"
                >
                  Vytvoriť účet
                </Link>
                <Link
                  href="/cennik"
                  className="block w-full md:w-auto md:inline-block rounded-full border-2 border-[#FDA4C7] bg-white/90 text-[#FDA4C7] text-base font-black py-4 md:px-8 text-center shadow-lg"
                >
                  Formy členstva
                </Link>
              </div>
            </div>
          </div>
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
                  <div className="mb-6">
                    <ExpandableText maxHeight={80} fadeColor="#FFF3F9">
                      <p className="text-[#6F2380]/65 text-[15px] leading-relaxed">{f.desc}</p>
                    </ExpandableText>
                  </div>

                  {/* Screenshoty */}
                  <div className="flex flex-col gap-3 mb-6">
                    {f.imgs.length === 1 ? (
                      <div
                        className="relative w-full aspect-video overflow-hidden rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: (isEven ? "#FDA4C7" : "#6F2380") + "18" }}
                      >
                        {f.imgs[0].src ? (
                          <Image src={f.imgs[0].src} alt={f.imgs[0].label} fill className="object-cover" />
                        ) : (
                          <p className="text-xs font-semibold text-center px-4" style={{ color: (isEven ? "#FDA4C7" : "#6F2380") + "60" }}>
                            {f.imgs[0].label}
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <div
                          className="relative w-full aspect-video overflow-hidden rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: f.accent + "18" }}
                        >
                          {f.imgs[0].src ? (
                            <Image src={f.imgs[0].src} alt={f.imgs[0].label} fill className="object-cover" />
                          ) : (
                            <p className="text-xs font-semibold px-4 text-center" style={{ color: f.accent + "70" }}>{f.imgs[0].label}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {f.imgs.slice(1).map((img, i) => (
                            <div
                              key={img.label + i}
                              className={`relative w-full ${f.secondaryAspect ?? "aspect-square"} overflow-hidden rounded-2xl flex items-center justify-center p-2`}
                              style={{ backgroundColor: (isEven ? "#6F2380" : "#FDA4C7") + "12" }}
                            >
                              {img.src ? (
                                <Image
                                  src={img.src}
                                  alt={img.label}
                                  fill
                                  className={img.fit === "contain" ? "object-contain p-4" : "object-cover"}
                                />
                              ) : (
                                <p className="text-[10px] font-semibold text-center leading-tight" style={{ color: (isEven ? "#6F2380" : "#FDA4C7") + "60" }}>
                                  {img.label}
                                </p>
                              )}
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
