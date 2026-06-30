import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Leaf, Brain, Stethoscope, Coffee, MapPin, Calendar, Clock } from "lucide-react";

const CITIES = ["Bratislava", "Nitra", "Košice", "Poprad", "Ďalšie mestá pribudnú"];

const EVENT_TYPES = [
  {
    icon: Leaf,
    accent: "#FDA4C7",
    title: "Joga workshopy",
    host: "Petra Joga",
    desc: "Workshopy špeciálne prispôsobené pre onkologických pacientov. Jemný pohyb, dýchanie a regenerácia tela — bez nároku na fyzickú kondíciu. V bezpečnom, chápanom prostredí.",
    imgs: ["[IMG-06] Foto Petra Joga", "[IMG] Workshop joga"],
  },
  {
    icon: Brain,
    accent: "#6F2380",
    title: "Mindfulness a meditácia",
    host: "Mirka Malejčíková / Zuzka Mindfulness",
    desc: "Skupinové sedenia zamerané na zvládanie stresu, dýchanie a prítomnosť v tele. Techniky MBSR prispôsobené realite onkologických pacientov. Online aj offline.",
    imgs: ["[IMG-07] Foto Mirka", "[IMG] Mindfulness skupinka"],
  },
  {
    icon: Stethoscope,
    accent: "#FDA4C7",
    title: "Odborné stretnutia",
    host: "Lekári, psychológovia, odborníci",
    desc: "Stretnutia s lekármi, psychológmi a ďalšími odborníkmi v malých skupinách. Priestor na otázky a zdieľanie skúseností bez časového tlaku. Témata vopred vyhlásené v kalendári.",
    imgs: ["[IMG] Odborné stretnutie", "[IMG] Rozhovor s lekárom"],
  },
  {
    icon: Coffee,
    accent: "#6F2380",
    title: "Komunity meetupy",
    host: "Komunita OnkoKlubu",
    desc: "Neformálne stretnutia členov OnkoKlubu. Káva, rozhovor, ľudia s podobnou skúsenosťou. Žiadny program, žiadny tlak — len ľudia, ktorí si rozumejú.",
    imgs: ["[IMG] Komunity meetup", "[IMG] Stretnutie členov"],
  },
];

const STEPS = [
  { title: "Pozri si kalendár",       desc: "Všetky nadchádzajúce eventy nájdeš v členskej sekcii, filtrované podľa tvojho kraja." },
  { title: "Rezervuj si miesto",      desc: "Jedným kliknutím — potvrdenie príde e-mailom. SMS pripomienka 24 hodín vopred." },
  { title: "Príď a spoznaj komunitu", desc: "Eventy sú pre členov zadarmo alebo so zvýhodnenou cenou. Kapacita je obmedzená." },
];

export default function AkciePage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">
            <div>
              <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">Po celom Slovensku</p>
              <h1 className="text-[2.4rem] md:text-[3.2rem] font-black text-[#6F2380] leading-[1.1] mb-5">
                Stretni sa s nami
                <br />
                vo tvojom meste.
              </h1>
              <p className="text-[#6F2380]/70 text-base leading-relaxed mb-8">
                Živé workshopy, stretnutia a akcie sa konajú pravidelne po celom Slovensku.
                Ako člen si rezervuješ miesto priamo z platformy — jedným kliknutím, zadarmo.
              </p>
              <div className="md:flex md:gap-3">
                <Link
                  href="/register"
                  className="block w-full md:w-auto md:inline-block rounded-full bg-[#FDA4C7] text-white text-base font-black py-4 md:px-10 text-center mb-3 md:mb-0"
                >
                  Chcem sa zapojiť
                </Link>
              </div>
            </div>
            {/* Kalendár placeholder — desktop only */}
            <div className="hidden md:block">
              <div className="w-full aspect-video rounded-[2rem] bg-[#6F2380]/15 flex flex-col items-center justify-center gap-2">
                <Calendar size={36} className="text-[#6F2380]/25" />
                <p className="text-[#6F2380]/25 text-xs font-semibold">[IMG-29] Screenshot kalendára eventov</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kalendár — mobile */}
      <section className="pb-12 md:hidden">
        <div className="px-5">
          <h2 className="text-xl font-black text-[#6F2380] mb-5">Kalendár eventov</h2>
          <div className="w-full aspect-video rounded-[2rem] bg-[#6F2380]/15 flex flex-col items-center justify-center gap-2 mb-4">
            <Calendar size={36} className="text-[#6F2380]/25" />
            <p className="text-[#6F2380]/25 text-xs font-semibold">[IMG-29] Screenshot kalendára eventov</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-square rounded-2xl bg-[#FDA4C7]/15 flex flex-col items-center justify-center gap-2">
              <Clock size={20} className="text-[#FDA4C7]/50" />
              <p className="text-[#FDA4C7]/50 text-[10px] font-semibold text-center px-2">[IMG] Detail eventu</p>
            </div>
            <div className="aspect-square rounded-2xl bg-[#6F2380]/10 flex flex-col items-center justify-center gap-2">
              <MapPin size={20} className="text-[#6F2380]/30" />
              <p className="text-[#6F2380]/30 text-[10px] font-semibold text-center px-2">[IMG] Mapa mestá</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mestá */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-xl font-black text-[#6F2380] mb-5">Kde sa stretávame</h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <div key={city} className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 border border-[#FDA4C7]/20">
                <MapPin size={12} className="text-[#FDA4C7] shrink-0" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-[#6F2380]">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typy eventov */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-xl font-black text-[#6F2380] mb-8">Typy akcií</h2>
          <div className="flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-10">
            {EVENT_TYPES.map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={e.title}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: e.accent }}>
                      <Icon size={18} className="text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-black text-[#6F2380] text-[16px] leading-tight">{e.title}</p>
                      <p className="text-[11px] font-semibold" style={{ color: e.accent }}>{e.host}</p>
                    </div>
                  </div>
                  <p className="text-[#6F2380]/65 text-[14px] leading-relaxed mb-4">{e.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {e.imgs.map((img, ii) => (
                      <div
                        key={img}
                        className={`rounded-2xl flex items-center justify-center p-3 ${ii === 0 ? "aspect-video col-span-2" : "aspect-square"}`}
                        style={{ backgroundColor: (i % 2 === 0 ? "#FDA4C7" : "#6F2380") + (ii === 0 ? "18" : "10") }}
                      >
                        <p className="text-[10px] font-semibold text-center leading-tight" style={{ color: (i % 2 === 0 ? "#FDA4C7" : "#6F2380") + "60" }}>
                          {img}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ako to funguje */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-xl font-black text-[#6F2380] mb-8">Ako to funguje</h2>
          <div className="relative pl-5 md:max-w-xl">
            <div className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-[#FDA4C7] via-[#FDA4C7]/50 to-transparent" />
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative flex gap-5 items-start pb-8 last:pb-0">
                <div className="relative z-10 w-10 h-10 rounded-full bg-[#FDA4C7] flex items-center justify-center shrink-0 shadow-[0_0_0_4px_#FFF3F9]">
                  <span className="text-white font-black text-base">{i + 1}</span>
                </div>
                <div className="pt-1.5">
                  <p className="font-black text-[#6F2380] text-[16px] mb-1">{s.title}</p>
                  <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="rounded-[1.8rem] bg-[#6F2380] p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Nájdi akciu vo tvojom kraji.</h2>
            <p className="text-white/65 text-sm leading-relaxed mb-6 md:max-w-sm md:mx-auto">
              Kalendár akcií je dostupný po registrácii. Kapacita na každom stretnutí je obmedzená.
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
