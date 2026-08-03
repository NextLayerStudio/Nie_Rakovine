"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { QrCode, ScanLine, Tag, BadgeCheck } from "lucide-react";
import { ExpandableText } from "@/components/landing/ExpandableText";
import { OkKartaCard } from "@/components/landing/OkKartaCard";

const HOW_STEPS = [
  {
    icon: BadgeCheck,
    title: "Registrácia",
    desc: "Po vytvorení účtu sa automaticky sprístupní vaša digitálna OK Karta s unikátnym QR kódom a identifikačným číslom.",
  },
  {
    icon: QrCode,
    title: "Vždy dostupná v mobile",
    desc: "OK Karta je uložená vo vašom profile a máte k nej prístup kedykoľvek, online aj offline. Nie je potrebná fyzická karta.",
  },
  {
    icon: ScanLine,
    title: "Uplatnenie výhod",
    desc: "Pri využívaní zliav stačí predložiť QR kód alebo uviesť svoje ID. Výhoda sa uplatní okamžite.",
  },
  {
    icon: Tag,
    title: "Vstup na podujatia",
    desc: "OK Karta slúži aj ako vstup na workshopy a podujatia. Registrácia prebieha jednoducho naskenovaním kódu bez potreby papierovej evidencie.",
  },
];

const PARTNERS: { name: string; logo: string }[] = [
  { name: "Nadácia SPP", logo: "/images/partneri/nadacia-spp.jpg" },
  { name: "RAJ zdravia", logo: "/images/partneri/raj-zdravia.png" },
  { name: "Meditesty", logo: "/images/partneri/meditesty-tmave-pozadie.png" },
  { name: "Dulcia.sk", logo: "/images/partneri/dulcia.png" },
  { name: "Hyundai", logo: "/images/partneri/hyundai.jpg" },
  { name: "Kittler", logo: "/images/partneri/kittler.png" },
  { name: "Visibility", logo: "/images/partneri/visibility.png" },
  { name: "Bratislava - Staré Mesto", logo: "/images/partneri/bratislava-stare-mesto.png" },
];

export function OKkartaSection() {
  return (
    <section className="pb-14"><div className="max-w-6xl mx-auto px-5 md:px-8">
      <div className="mb-14 md:flex md:items-center md:justify-between md:gap-8">
        {/* Nadpis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-0 md:max-w-md"
        >
          <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
            Zľavy a benefity
          </p>
          <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1] mb-4">
            Vaša OK Karta.
            <br />
            Výhody, ktoré máte vždy pri sebe.
          </h2>
          <ExpandableText maxHeight={80} fadeColor="#FFF3F9">
            <p className="text-[#6F2380]/65 text-base leading-relaxed">
              Ako člen/ka ONKO KLUBU získavate digitálnu OK Kartu s QR kódom, vďaka
              ktorej môžete využívať zvýhodnené ponuky a benefity u vybraných
              partnerov po celom Slovensku.
            </p>
          </ExpandableText>
        </motion.div>

        {/* Vizuál karty — presne rovnaký dizajn ako reálna OK Karta v aplikácii */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="md:max-w-xl md:shrink-0"
        >
          <OkKartaCard />
        </motion.div>
      </div>

      {/* Ako to funguje — cestička */}
      <div className="mb-14">
        <h3 className="text-xl font-black text-[#6F2380] mb-8">Ako OK Karta funguje</h3>
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
                <div className="pt-1.5 min-w-0">
                  <p className="font-black text-[#6F2380] text-[16px] mb-1">{s.title}</p>
                  <ExpandableText maxHeight={56} fadeColor="#FFF3F9">
                    <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{s.desc}</p>
                  </ExpandableText>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Partneri */}
      <div className="mb-10">
        <h3 className="text-xl font-black text-[#6F2380] mb-2">Naši partneri</h3>
        <div className="mb-7">
          <ExpandableText maxHeight={64} fadeColor="#FFF3F9">
            <p className="text-[#6F2380]/50 text-sm leading-relaxed">
              ONKO KLUB rastie vďaka partnerom, ktorých dôvera a ochota pomáhať
              prinášajú konkrétnu podporu ľuďom s onkologickým ochorením. Sme
              vďační, že spoločne môžeme byť oporou tam, kde je to najviac
              potrebné.
            </p>
          </ExpandableText>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PARTNERS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="aspect-square rounded-2xl bg-white flex items-center justify-center p-3"
              style={{ border: `1.5px solid ${i % 2 === 0 ? "#FDA4C7" : "#6F2380"}22` }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={p.logo}
                  alt={p.name}
                  fill
                  sizes="140px"
                  className="object-contain"
                />
              </div>
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
          Získajte svoju OK Kartu
        </h3>
        <div className="mb-7">
          <ExpandableText maxHeight={60} fadeColor="#6F2380" align="center">
            <p className="text-white/65 text-sm leading-relaxed">
              Vaša OK Karta bude dostupná okamžite po prvom prihlásení. Bez
              poplatkov a bez zbytočnej administratívy.
            </p>
          </ExpandableText>
        </div>
        <Link
          href="/register"
          className="block w-full rounded-full bg-[#FDA4C7] text-white font-black text-base py-4 active:scale-[0.98] transition-transform"
        >
          Aktivovať OK Kartu
        </Link>
      </motion.div>
      </div>
    </section>
  );
}
