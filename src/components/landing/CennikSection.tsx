"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

const BENEFITY = [
  "Prístup ku všetkým videám a materiálom",
  "Odborné prednášky a podcasty zadarmo",
  "Rezervácia na eventy a workshopy",
  "Onkorumky — prístup do všetkých 29 fór",
  "Exkluzívne zľavy od partnerských značiek",
  "Digitálna OKkarta s QR kódom",
  "Mood Meter — sledovanie pohody",
  "Sociálny kompas",
];

export function CennikSection() {
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
          Vyber si, ako chceš
          <br />
          byť členom.
        </h2>
        <p className="text-[#6F2380]/55 text-base">Bez záväzkov. Zrušiť môžeš kedykoľvek.</p>
      </motion.div>

      <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:max-w-2xl md:mx-auto">
        {/* Ročné — highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[1.8rem] bg-[#6F2380] px-6 py-7 relative overflow-hidden"
        >
          {/* dekorácia */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5" />

          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-1.5 bg-[#FDA4C7] rounded-full px-3 py-1">
              <Star size={11} className="text-white fill-white" />
              <span className="text-white text-[11px] font-black">Najobľúbenejšie</span>
            </div>
          </div>

          <p className="text-white/55 text-xs font-bold uppercase tracking-wider mb-1">Ročné členstvo</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-white font-black text-[3rem] leading-none">60 €</span>
            <span className="text-white/50 text-sm mb-2">/ rok</span>
          </div>
          <p className="text-[#FDA4C7] text-sm font-bold mb-6">= 5 € mesačne · platíš raz ročne</p>

          <div className="flex flex-col gap-2.5 mb-7">
            {BENEFITY.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FDA4C7] flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-white/80 text-[13px]">{b}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 mt-1">
              <div className="w-5 h-5 rounded-full bg-[#FDA4C7] flex items-center justify-center shrink-0">
                <Check size={11} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-white/80 text-[13px]">Platíš raz — nemusíš na to myslieť celý rok</span>
            </div>
          </div>

          <Link
            href="/register?plan=annual"
            className="block w-full rounded-full bg-[#FDA4C7] text-white font-black text-base py-4 text-center active:scale-[0.98] transition-transform"
          >
            Začať ročne
          </Link>
        </motion.div>

        {/* Mesačné */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[1.8rem] bg-white border border-[#FDA4C7]/20 px-6 py-7"
        >
          <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Mesačné členstvo</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-[#6F2380] font-black text-[3rem] leading-none">5 €</span>
            <span className="text-[#6F2380]/40 text-sm mb-2">/ mesiac</span>
          </div>
          <p className="text-[#6F2380]/40 text-sm mb-6">Platíš každý mesiac · zrušiš kedykoľvek</p>

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
            className="block w-full rounded-full border-2 border-[#FDA4C7] text-[#FDA4C7] font-black text-base py-4 text-center active:scale-[0.98] transition-transform"
          >
            Začať mesačne
          </Link>
        </motion.div>
      </div>

      <p className="text-[#6F2380]/35 text-[11px] text-center mt-5 leading-relaxed px-2">
        Platba kartou online cez GoPay. Bezpečná platba, šifrované spojenie.
        <br />
        Záujem o trvalý príkaz? Napíš nám na{" "}
        <a href="mailto:office@nierakovine.sk" className="underline">office@nierakovine.sk</a>.
      </p>
      </div>
    </section>
  );
}
