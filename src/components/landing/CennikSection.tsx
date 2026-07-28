"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Star, ShieldCheck, RefreshCw, CreditCard, ChevronDown } from "lucide-react";
import { ExpandableText } from "@/components/landing/ExpandableText";
import { SupporterCard } from "@/components/landing/SupporterCard";

const PAYMENT_LOGOS = [
  { src: "/images/platby/gopay.png", alt: "GoPay", w: 100, h: 35 },
  { src: "/images/platby/visa.png", alt: "VISA", w: 67, h: 23 },
  { src: "/images/platby/verified-by-visa.png", alt: "Verified by VISA", w: 67, h: 30 },
  { src: "/images/platby/mastercard.png", alt: "Mastercard", w: 67, h: 43 },
  { src: "/images/platby/mastercard-securecode.png", alt: "Mastercard SecureCode", w: 86, h: 40 },
  { src: "/images/platby/maestro.png", alt: "Maestro", w: 67, h: 43 },
];

const BENEFITY = [
  "Prístup ku všetkým videám a materiálom prispôsobeným potrebám onkologických pacientov",
  "Bezplatné odborné prednášky a podcasty",
  "Pohodlné rezervácie na podujatia a workshopy",
  "Prístup do všetkých diskusných fór",
  "Exkluzívne zľavy u partnerských značiek",
  "Digitálna OK Karta s QR kódom",
  "Sociálny kompas",
];

const CENNIK_INFO = [
  { icon: CreditCard, title: "Bezpečná online platba", desc: "Platba prebieha cez platobnú bránu GoPay." },
  { icon: RefreshCw, title: "Flexibilné členstvo", desc: "Členstvo môžete kedykoľvek zrušiť bez záväzkov a ďalších podmienok." },
  { icon: ShieldCheck, title: "Bez skrytých poplatkov", desc: "Cena členstva je jasná a bez dodatočných nákladov." },
];

const REINVESTICIA_TEXT =
  "Všetky finančné prostriedky získané prostredníctvom ONKO KLUBU vraciame späť do systému pomoci. Vďaka nim dokážeme zabezpečovať fungovanie pacientskych poradní NIE RAKOVINE, poskytovať bezplatné poradenstvo a rozvíjať pomoc, ktorú pacienti s rakovinou na Slovensku potrebujú.";

const PLATBA_FAQ = [
  {
    q: "Ako prebieha platba za členstvo?",
    a: "Free členstvo je úplne zadarmo. Platba za Mesačné a Ročné členstvo prebieha online cez platobnú bránu GoPay a automaticky sa obnovuje (mesačne, resp. ročne). Podporujúce členstvo je jednorazová platba vo vami zvolenej výške (min. 50 €), ktorá sa neobnovuje. Platbu je možné kedykoľvek zrušiť v nastaveniach vášho účtu. Ak uprednostňujete úhradu formou trvalého príkazu, kontaktujte nás, prosím, na office@onkoklub.sk.",
  },
  {
    q: "Je možné členstvo kedykoľvek zrušiť?",
    a: "Áno. Členstvo môžete kedykoľvek zrušiť v nastaveniach svojho účtu bez sankcií a bez ďalších záväzkov. Prístup k platforme vám zostane aktívny do konca už zaplateného obdobia.",
  },
  {
    q: "Má členstvo skúšobné obdobie?",
    a: "Členstvo si môžete vyskúšať bez záväzkov. Ak sa rozhodnete v prvom mesiaci nepokračovať, stačí ho jednoducho zrušiť. Bez pokuty a akýchkoľvek sankcií.",
  },
  {
    q: "Sú moje osobné a zdravotné údaje v bezpečí?",
    a: "Áno. Citlivé údaje sú šifrované na úrovni aplikácie. Dáta sú ukladané na serveroch v rámci EÚ (región Frankfurt) a neopúšťajú územie Európskej únie. Spracúvanie osobných údajov prebieha v súlade s nariadením GDPR.",
  },
];

export function CennikSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="pb-20">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
          Cenník
        </p>
        <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1] mb-3">
          Každý nový člen robí ONKO KLUB silnejším
        </h2>
        <p className="text-[#6F2380]/55 text-base mb-6">
          Ďakujeme, že sa stávate súčasťou komunity, ktorá nie je len miestom podpory, ale aj silným hlasom pacientov s rakovinou. Spoločne spájame naše skúsenosti a príbehy, aby sme dokázali prinášať reálne zmeny v prospech ľudí s onkologickým ochorením.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CENNIK_INFO.map((info) => {
            const Icon = info.icon;
            return (
              <div key={info.title} className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-[#FDA4C7]/15">
                <div className="w-9 h-9 rounded-xl bg-[#FDA4C7]/15 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-[#FDA4C7]" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-black text-[#6F2380] text-[13px] leading-tight mb-0.5">{info.title}</p>
                  <p className="text-[#6F2380]/55 text-[12px] leading-snug">{info.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
          {PAYMENT_LOGOS.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={logo.h}
              className="h-7 w-auto object-contain"
            />
          ))}
        </div>
      </motion.div>

      <h3 className="text-xl font-black text-[#6F2380] mb-5">Čo vás čaká po registrácii</h3>

      <div className="grid grid-cols-1 gap-4 items-stretch sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {/* Free */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col rounded-[1.8rem] border border-[#FDA4C7]/20 bg-[#FFF8FB] px-6 py-7"
        >
          <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Free členstvo</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-[#6F2380] font-black text-[2.4rem] leading-none">0 €</span>
          </div>
          <p className="text-[#6F2380]/40 text-sm mb-6">Základný prístup, úplne zadarmo</p>
          <Link
            href="/register?plan=free"
            className="mt-auto block w-full rounded-full bg-[#FDA4C7] text-white font-black text-sm py-3.5 text-center active:scale-[0.98] transition-transform"
          >
            Registrovať zadarmo
          </Link>
        </motion.div>

        {/* Mesačné */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="flex flex-col rounded-[1.8rem] bg-[#FFEDF4] border border-[#FDA4C7]/25 px-6 py-7"
        >
          <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Mesačné členstvo</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-[#6F2380] font-black text-[2.4rem] leading-none">5 €</span>
            <span className="text-[#6F2380]/40 text-sm mb-1">/ mes.</span>
          </div>
          <p className="text-[#6F2380]/40 text-sm mb-6">Platíš mesačne · zrušíš kedykoľvek</p>

          <div className="flex flex-col gap-2.5 mb-7">
            {BENEFITY.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FDA4C7]/20 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-[#FDA4C7]" strokeWidth={3} />
                </div>
                <span className="text-[#6F2380]/65 text-[13px]">{b}</span>
              </div>
            ))}
          </div>

          <Link
            href="/register?plan=monthly"
            className="mt-auto block w-full rounded-full bg-[#FDA4C7] text-white font-black text-sm py-3.5 text-center active:scale-[0.98] transition-transform"
          >
            Zvoliť mesačné členstvo
          </Link>

          <div className="mt-5">
            <ExpandableText maxHeight={48} fadeColor="#FFEDF4">
              <p className="text-[#6F2380]/40 text-[11px] leading-relaxed">
                {REINVESTICIA_TEXT}
              </p>
            </ExpandableText>
          </div>
        </motion.div>

        {/* Ročné — highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col rounded-[1.8rem] bg-[#FFD9E8] border border-[#FDA4C7]/30 px-6 py-7 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1">
              <Star size={11} className="text-[#FDA4C7] fill-[#FDA4C7]" />
              <span className="text-[#FDA4C7] text-[11px] font-black">Najobľúbenejšie</span>
            </div>
          </div>

          <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Ročné členstvo</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-[#6F2380] font-black text-[2.4rem] leading-none">50 €</span>
            <span className="text-[#6F2380]/40 text-sm mb-1">/ rok</span>
          </div>
          <p className="text-[#6F2380] text-sm font-bold mb-6">Ušetríš 10 € oproti mesačnému plánu</p>

          <div className="flex flex-col gap-2.5 mb-7">
            {BENEFITY.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Check size={11} className="text-[#FDA4C7]" strokeWidth={3} />
                </div>
                <span className="text-[#6F2380]/70 text-[13px]">{b}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 mt-1">
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                <Check size={11} className="text-[#FDA4C7]" strokeWidth={3} />
              </div>
              <span className="text-[#6F2380]/70 text-[13px]">Jednorazová platba bez nutnosti aktualizácie počas roka</span>
            </div>
          </div>

          <Link
            href="/register?plan=annual"
            className="mt-auto block w-full rounded-full bg-[#FDA4C7] text-white font-black text-sm py-3.5 text-center active:scale-[0.98] transition-transform"
          >
            Zvoliť ročné členstvo
          </Link>

          <div className="mt-5">
            <ExpandableText maxHeight={48} fadeColor="#FFD9E8">
              <p className="text-[#6F2380]/50 text-[11px] leading-relaxed">
                {REINVESTICIA_TEXT}
              </p>
            </ExpandableText>
          </div>
        </motion.div>

        {/* Podporujúce — vlastná suma */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <SupporterCard />
        </motion.div>
      </div>

      <div className="mt-14 md:max-w-2xl md:mx-auto">
        <h3 className="text-xl font-black text-[#6F2380] mb-5">Časté otázky k platbe</h3>
        <div className="flex flex-col gap-2">
          {PLATBA_FAQ.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q} className="rounded-2xl bg-white border border-[#FDA4C7]/15 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-bold text-[#6F2380] text-[14px]">{item.q}</span>
                  <ChevronDown
                    size={16}
                    className="text-[#FDA4C7] shrink-0 transition-transform"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                {open && (
                  <p className="px-5 pb-4 text-[#6F2380]/60 text-[13px] leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}
