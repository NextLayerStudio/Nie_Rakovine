import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Leaf, Brain, Stethoscope, Coffee, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { PublicEvent } from "@/components/landing/EventCard";
import { EventsFilterProvider } from "@/components/landing/EventsFilterContext";
import { EventsFilterToggle } from "@/components/landing/EventsFilterToggle";
import { CategoryFilterBar } from "@/components/landing/CategoryFilterBar";
import { PublicEventsExplorer } from "@/components/landing/PublicEventsExplorer";

export const dynamic = "force-dynamic";

const CITIES = ["Bratislava", "Nitra", "Košice", "Poprad", "a ďalšie"];

const EVENT_TYPES: {
  icon: typeof Leaf;
  accent: string;
  title: string;
  host: string;
  desc: string;
}[] = [
  {
    icon: Leaf,
    accent: "#FDA4C7",
    title: "Onko-joga workshopy",
    host: "Petra Joga",
    desc: "Jemné cvičenie prispôsobené potrebám onkologických pacientov. V bezpečnom a podpornom prostredí, bez ohľadu na kondíciu či predchádzajúce skúsenosti.",
  },
  {
    icon: Brain,
    accent: "#6F2380",
    title: "Mindfulness a meditácia",
    host: "Mirka Malejčíková / Zuzka Mindfulness",
    desc: "Skupinové stretnutia zamerané na zvládanie stresu, vedomé dýchanie, uvoľnenie a vnímanie vlastného tela.",
  },
  {
    icon: Stethoscope,
    accent: "#FDA4C7",
    title: "Odborné podujatia",
    host: "Lekári, psychológovia, odborníci",
    desc: "Diskusie a prednášky s lekármi, psychológmi a ďalšími odborníkmi. Priestor na otázky, nové informácie a zdieľanie skúseností.",
  },
  {
    icon: Coffee,
    accent: "#6F2380",
    title: "Podporné stretnutia",
    host: "Komunita ONKO KLUBU",
    desc: "Neformálne stretnutia členov ONKO KLUBU – priestor na rozhovory, vzájomnú podporu a spájanie ľudí s podobnou životnou skúsenosťou.",
  },
];

const STEPS = [
  { title: "Vyberte si podujatie",       desc: "V členskej sekcii nájdete prehľad pripravovaných workshopov, stretnutí a podujatí z celého Slovenska, prehľadne usporiadaných podľa regiónov." },
  { title: "Prihláste sa online",        desc: "Svoje miesto si rezervujete jednoducho priamo v aplikácii ONKO KLUB. Po registrácii vám zašleme potvrdenie a včas vám pripomenieme termín podujatia." },
  { title: "Stretnite ľudí, ktorí vám rozumejú", desc: "Podujatia sú určené členom ONKO KLUBU a mnohé z nich sú bezplatné alebo za zvýhodnených podmienok. Počet miest býva obmedzený, preto odporúčame prihlásiť sa vopred." },
];

export default async function AkciePage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startsAt: "asc" },
    take: 3,
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      coverUrl: true,
      location: true,
      region: true,
      startsAt: true,
      endsAt: true,
      capacity: true,
      visibility: true,
      _count: { select: { tickets: true } },
    },
  });

  const topEvents: PublicEvent[] = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    category: e.category,
    coverUrl: e.coverUrl,
    location: e.location,
    region: e.region,
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt ? e.endsAt.toISOString() : null,
    capacity: e.capacity,
    visibility: e.visibility,
    registrationCount: e._count.tickets,
  }));

  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      {/* Kalendár aktivít — všetky podujatia na Slovensku */}
      <EventsFilterProvider>
        <section className="pt-24 pb-4">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-[#6F2380] md:text-2xl">Kalendár aktivít</h2>
              <EventsFilterToggle />
            </div>
            <CategoryFilterBar category="" className="mt-4 hidden flex-wrap gap-2 lg:flex" />
          </div>
        </section>

        <section className="pb-14">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <PublicEventsExplorer events={topEvents} category="" />
          </div>
        </section>
      </EventsFilterProvider>

      {/* Hero */}
      <section className="pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="md:max-w-2xl">
            <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">Podujatia po celom Slovensku</p>
            <h1 className="text-[2.4rem] md:text-[3.2rem] font-black text-[#6F2380] leading-[1.1] mb-5">
              Príďte načerpať podporu a nové skúsenosti
            </h1>
            <p className="text-[#6F2380]/70 text-base leading-relaxed mb-8">
              Workshopy, skupinové stretnutia a odborné podujatia sú dostupné vo viacerých
              regiónoch Slovenska. Ako člen/ka ONKO KLUBU máte možnosť prihlásiť sa na
              vybrané aktivity jednoducho priamo v aplikácii ONKO KLUB.
            </p>
            <div className="md:flex md:gap-3">
              <Link
                href="/podujatia"
                className="block w-full md:w-auto md:inline-block rounded-full bg-[#FDA4C7] text-white text-base font-black py-4 md:px-10 text-center mb-3 md:mb-0"
              >
                Chcem vedieť o podujatiach v mojom okolí
              </Link>
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
          <h2 className="text-xl font-black text-[#6F2380] mb-8">Vyberte si z ponuky workshopov, prednášok a stretnutí</h2>
          <div className="flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-10">
            {EVENT_TYPES.map((e) => {
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
                  <p className="text-[#6F2380]/65 text-[14px] leading-relaxed">{e.desc}</p>
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
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Vyberte si podujatie, ktoré vám vyhovuje</h2>
            <p className="text-white/65 text-sm leading-relaxed mb-6 md:max-w-sm md:mx-auto">
              Po registrácii získate prístup ku kalendáru workshopov, prednášok a podporných
              stretnutí po celom Slovensku aj online. Miesta na vybraných podujatiach sú z
              kapacitných dôvodov obmedzené.
            </p>
            <Link href="/pripravujeme" className="inline-block rounded-full bg-[#FDA4C7] text-white font-black text-base px-10 py-4">
              Zobraziť podujatia
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
