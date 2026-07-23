import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { QrCode, ScanLine, BadgeCheck, Tag, Check } from "lucide-react";
import { ExpandableText } from "@/components/landing/ExpandableText";

const KATEGORIE = [
  "Zdravie a starostlivosť o telo",
  "Výživa, doplnky a zdravý životný štýl",
  "Pohyb, rehabilitácia a fyzická aktivita",
  "Spánok a regenerácia",
  "Kozmetika a starostlivosť o pokožku",
  "Technológie pre zdravie",
  "Voľnočasové aktivity",
  "Duševná pohoda a relaxácia",
];

const HOW_STEPS = [
  { icon: BadgeCheck, title: "Aktivujte svoje členstvo",      desc: "Po registrácii a aktivácii členstva sa vám automaticky vytvorí digitálna OK karta s unikátnym QR kódom a členským ID." },
  { icon: QrCode,     title: "Vyberte si partnerskú ponuku",  desc: "V sekcii Zľavy a benefity nájdete prehľad aktuálnych ponúk a zvýhodnení od partnerských značiek, ktoré si môžete jednoducho filtrovať podľa jednotlivých kategórií." },
  { icon: ScanLine,   title: "Uplatnite si zľavu",            desc: "Pri nákupe v predajni alebo v e-shope sa preukážete svojou OK kartou alebo uvediete členské ID. Zľava alebo benefit sa vám uplatní podľa podmienok konkrétneho partnera." },
];

export default function SponzoriPage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">
            <div>
              <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">Exkluzívne len pre členov ONKO KLUBU</p>
              <h1 className="text-[2.4rem] md:text-[3.2rem] font-black text-[#6F2380] leading-[1.1] mb-5">
                Špeciálne zľavy len pre členov ONKO KLUBU
              </h1>
              <div className="mb-8">
                <ExpandableText maxHeight={72} fadeColor="#FFF3F9">
                  <p className="text-[#6F2380]/70 text-base leading-relaxed">
                    Ako člen/ka ONKO KLUBU máte vďaka našim partnerom možnosť
                    využiť špeciálne zľavy. Stačí sa preukázať OK kartou a zľava
                    sa vám automaticky uplatní.
                  </p>
                </ExpandableText>
              </div>
              <Link
                href="/register"
                className="block w-full md:w-auto md:inline-block rounded-full bg-[#FDA4C7] text-white text-base font-black py-4 md:px-10 text-center"
              >
                Chcem zľavy pre členov
              </Link>
            </div>
            {/* Citát — desktop only */}
            <div className="hidden md:block">
              <div className="rounded-[2rem] bg-[#6F2380] px-7 py-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5" />
                <div className="relative z-10">
                  <ExpandableText maxHeight={120} fadeColor="#6F2380">
                    <p className="text-white font-black text-[1.5rem] leading-snug">
                      Partnerské zľavy prinášajú reálnu úsporu, ktorá môže prevýšiť náklady na členstvo.
                    </p>
                  </ExpandableText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Citát — mobile */}
      <section className="pb-12 md:hidden">
        <div className="px-5">
          <div className="rounded-[2rem] bg-[#6F2380] px-6 py-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5" />
            <div className="relative z-10">
              <ExpandableText maxHeight={120} fadeColor="#6F2380">
                <p className="text-white font-black text-[1.5rem] leading-snug">
                  Partnerské zľavy prinášajú reálnu úsporu, ktorá môže prevýšiť náklady na členstvo.
                </p>
              </ExpandableText>
            </div>
          </div>
        </div>
      </section>

      {/* OK karta vizuál + benefity */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-14 md:items-center">
            {/* Karta vizuál */}
            <div>
              <h2 className="text-xl font-black text-[#6F2380] mb-5">Tvoja OK karta</h2>
              <div className="w-full md:max-w-xs aspect-[9/16] max-h-[360px] rounded-[2rem] bg-[#FDA4C7]/20 flex flex-col items-center justify-center gap-3 mb-6">
                <QrCode size={40} className="text-[#FDA4C7]/40" />
                <p className="text-[#FDA4C7]/50 text-xs font-semibold">[IMG-24] OK karta na telefóne</p>
              </div>
            </div>
            {/* Benefity */}
            <div>
              <div className="flex flex-col gap-2">
                {[
                  "OK karta sa vytvorí ihneď po dokončení registrácie",
                  "Každý člen má vlastný identifikátor",
                  "Vstupenka na podujatia a workshopy",
                  "Prehľadný preukaz člena vždy v mobile",
                  "Uplatnenie zliav",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FDA4C7]/20 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-[#FDA4C7]" strokeWidth={3} />
                    </div>
                    <span className="text-[#6F2380]/70 text-[14px]">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ako to funguje */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-xl font-black text-[#6F2380] mb-8">Ako využívať zľavy a benefity</h2>
          <div className="relative pl-5 md:max-w-xl">
            <div className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-[#FDA4C7] via-[#FDA4C7]/50 to-transparent" />
            {HOW_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="relative flex gap-5 items-start pb-8 last:pb-0">
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_#FFF3F9]"
                    style={{ backgroundColor: i % 2 === 0 ? "#FDA4C7" : "#6F2380" }}
                  >
                    <Icon size={17} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="pt-1.5 min-w-0">
                    <p className="font-black text-[#6F2380] text-[16px] mb-1">{s.title}</p>
                    <ExpandableText maxHeight={56} fadeColor="#FFF3F9">
                      <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{s.desc}</p>
                    </ExpandableText>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Screenshot zliav v appke */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-xl font-black text-[#6F2380] mb-5">Zľavy v aplikácii</h2>
          <div className="flex flex-col gap-3 md:grid md:grid-cols-3">
            <div className="w-full aspect-video rounded-[2rem] bg-[#6F2380]/15 flex flex-col items-center justify-center gap-2 md:col-span-2">
              <Tag size={32} className="text-[#6F2380]/25" />
              <p className="text-[#6F2380]/25 text-xs font-semibold">[IMG-30] Screenshot sekcie zliav</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
              <div className="aspect-square rounded-2xl bg-[#FDA4C7]/15 flex items-center justify-center">
                <p className="text-[#FDA4C7]/50 text-[10px] font-semibold text-center px-2">[IMG] Detail zľavy</p>
              </div>
              <div className="aspect-square rounded-2xl bg-[#6F2380]/10 flex items-center justify-center">
                <p className="text-[#6F2380]/30 text-[10px] font-semibold text-center px-2">[IMG] QR skenovanie</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kategórie partnerov */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-xl font-black text-[#6F2380] mb-2">Kategórie partnerov</h2>
          <p className="text-[#6F2380]/50 text-sm mb-8">
            Zatiaľ ešte nevieme, ktoré značky sa k nám pridajú — tu je prehľad
            kategórií, v ktorých partnerov hľadáme.
          </p>
          <div className="flex flex-wrap gap-2">
            {KATEGORIE.map((kat, i) => (
              <span
                key={kat}
                className="text-sm font-semibold px-4 py-2 rounded-full text-[#6F2380]"
                style={{
                  backgroundColor: (i % 2 === 0 ? "#FDA4C7" : "#6F2380") + "18",
                  border: `1.5px solid ${(i % 2 === 0 ? "#FDA4C7" : "#6F2380")}30`,
                }}
              >
                {kat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="rounded-[2rem] bg-[#6F2380] px-6 py-10 md:py-14 text-center">
            <h2 className="text-[2rem] md:text-[2.4rem] font-black text-white leading-tight mb-3">Získajte svoju OK kartu</h2>
            <p className="text-white/65 text-sm leading-relaxed mb-7 md:max-w-sm md:mx-auto">
              Po registrácii a aktivácii členstva získate okamžitý prístup k
              digitálnej OK karte s unikátnym QR kódom. Nájdete ju vo svojom
              profile, pripravenú na okamžité používanie.
            </p>
            <Link href="/register" className="inline-block rounded-full bg-[#FDA4C7] text-white font-black text-base px-10 py-4">
              Chcem svoju OK kartu
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
