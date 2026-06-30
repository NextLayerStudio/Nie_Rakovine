"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { QrCode, ScanLine, Tag, BadgeCheck } from "lucide-react";

const HOW_STEPS = [
  {
    icon: BadgeCheck,
    title: "Zaregistruj sa",
    desc: "Po registrácii ti OnkoKlub automaticky vygeneruje tvoju osobnú OKkartu s unikátnym QR kódom a ID.",
  },
  {
    icon: QrCode,
    title: "OKkarta je vždy v telefóne",
    desc: "Kartu nájdeš vo svojom profile alebo v sekcii OKkarta — kedykoľvek, offline aj online. Fyzickú kartu nepotrebuješ.",
  },
  {
    icon: ScanLine,
    title: "Skenuj a šetri",
    desc: "Pri nákupe v predajni alebo v e-shope stačí naskenovať QR kód alebo napísať svoje ID. Zľava sa uplatní okamžite — len pre členov OnkoKlubu.",
  },
  {
    icon: Tag,
    title: "Evidencia workshopov",
    desc: "OKkarta slúži aj ako vstupenka na workshopy a akcie — organizátor ťa odčíta skenovaním, žiadne papiere.",
  },
];

const PARTNERS: { name: string; category: string }[] = [
  { name: "Partner 1", category: "Lekáreň" },
  { name: "Partner 2", category: "Výživa" },
  { name: "Partner 3", category: "Wellness" },
  { name: "Partner 4", category: "Oblečenie" },
  { name: "Partner 5", category: "Online obchod" },
  { name: "Partner 6", category: "Zdravotné pomôcky" },
];

export function OKkartaSection() {
  return (
    <section className="pb-20"><div className="max-w-6xl mx-auto px-5 md:px-8">
      {/* Nadpis */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
          Sponzori a zľavy
        </p>
        <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1] mb-4">
          Tvoja OKkarta.
          <br />
          Zľavy, ktoré si zaslúžiš.
        </h2>
        <p className="text-[#6F2380]/65 text-base leading-relaxed">
          Každý člen OnkoKlubu dostane automaticky svoju osobnú OKkartu —
          digitálnu členskú kartu s QR kódom, ktorá otvára exkluzívne zľavy
          u partnerov OnkoKlubu po celom Slovensku.
        </p>
      </motion.div>

      {/* Vizuál karty */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="mb-14 md:max-w-xs"
        style={{ rotate: "-2deg" }}
      >
        <div
          className="relative w-full rounded-[1.8rem] overflow-hidden"
          style={{
            aspectRatio: "1.586",
            background: "linear-gradient(135deg, #6F2380 0%, #9B3BAF 45%, #CA6A8A 100%)",
          }}
        >
          {/* dekoratívny kruh */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />

          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            {/* hlavička */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                  OnkoKlub
                </p>
                <p className="text-white font-black text-xl leading-none">OKkarta</p>
              </div>
              <div className="bg-white/15 rounded-xl p-2.5">
                <QrCode size={28} className="text-white" strokeWidth={1.5} />
              </div>
            </div>

            {/* ID placeholder */}
            <div>
              <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-1">
                Člen
              </p>
              <p className="text-white font-black text-lg tracking-wide">Tvoje meno</p>
              <p className="text-white/45 text-xs mt-0.5 font-mono tracking-widest">
                OK · 0000 · 0000
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ako to funguje — cestička */}
      <div className="mb-14">
        <h3 className="text-xl font-black text-[#6F2380] mb-8">Ako OKkarta funguje</h3>
        <div className="relative pl-5">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{ originY: 0 }}
            className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-[#6F2380] via-[#FDA4C7]/60 to-transparent"
          />

          {HOW_STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="relative flex gap-5 items-start pb-8 last:pb-0"
              >
                <div
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_#FFF3F9]"
                  style={{ backgroundColor: i % 2 === 0 ? "#6F2380" : "#FDA4C7" }}
                >
                  <Icon size={17} className="text-white" strokeWidth={2} />
                </div>
                <div className="pt-1.5">
                  <p className="font-black text-[#6F2380] text-[16px] mb-1">{s.title}</p>
                  <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Partneri */}
      <div className="mb-10">
        <h3 className="text-xl font-black text-[#6F2380] mb-2">Naši partneri</h3>
        <p className="text-[#6F2380]/50 text-sm leading-relaxed mb-7">
          Rastúca sieť značiek, ktoré stoja za onkologickými pacientmi.
          Každý partner ponúka exkluzívne zľavy len pre držiteľov OKkarty.
        </p>

        {/* [IMG] Logá partnerov — sem prídu skutočné logá */}
        <div className="grid grid-cols-3 gap-3">
          {PARTNERS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5"
              style={{ backgroundColor: i % 2 === 0 ? "#FDA4C7" + "15" : "#6F2380" + "0D", border: `1.5px solid ${i % 2 === 0 ? "#FDA4C7" : "#6F2380"}22` }}
            >
              {/* [LOGO] */}
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: i % 2 === 0 ? "#FDA4C7" + "40" : "#6F2380" + "25" }}
              />
              <p className="text-[#6F2380] text-[10px] font-black text-center leading-tight px-1">{p.name}</p>
              <p className="text-[#6F2380]/35 text-[9px] text-center">{p.category}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-[#6F2380]/35 text-xs text-center mt-4">
          Ďalší partneri pribudnú čoskoro
        </p>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="rounded-[2rem] bg-[#6F2380] px-6 py-8 text-center"
      >
        <h3 className="text-[1.5rem] font-black text-white leading-snug mb-3">
          Získaj svoju OKkartu.
        </h3>
        <p className="text-white/65 text-sm leading-relaxed mb-7">
          Stačí sa zaregistrovať — karta čaká hneď po prvom prihlásení.
          Žiadne poplatky, žiadne formuláre.
        </p>
        <Link
          href="/register"
          className="block w-full rounded-full bg-[#FDA4C7] text-white font-black text-base py-4 active:scale-[0.98] transition-transform"
        >
          Chcem svoju OKkartu
        </Link>
      </motion.div>
      </div>
    </section>
  );
}
