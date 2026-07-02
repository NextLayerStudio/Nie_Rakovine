"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const OTAZKY = [
  "Kde môžem požiadať o poskytovanie peňažného príspevku?",
  "Čo musí obsahovať žiadosť o peňažný príspevok a aké doklady potrebujem?",
  "Čo musím urobiť a kam mám ísť, ak chcem požiadať o preukaz ŤZP, či parkovací preukaz?",
  "Ako podať žiadosť o invalidný dôchodok?",
  "Kde nájdem potrebné formuláre a ako ich vyplniť?",
  "Ako dlho trvá vybavenie sociálnych dávok a čo ho môže ovplyvniť?",
];

export function SocialnyKompassSection() {
  return (
    <section className="pb-20"><div className="max-w-6xl mx-auto px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
          Sociálny kompas
        </p>
        <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1] mb-4">
          Sme tu, aby sme vám pomohli
        </h2>
        <p className="text-[#6F2380]/65 text-base leading-relaxed">
          Vieme, aké ťažké je prechádzať nielen fyzickými, ale aj psychickými
          výzvami počas onkologického ochorenia. Ako člen/ka ONKO KLUBU máte
          k dispozícii všetky informácie potrebné na zorientovanie sa v
          systéme sociálnej pomoci. Našou misiou je ušetriť vám čas a stres –
          pomôžeme vám s formulármi k peňažným príspevkom, invalidnému
          dôchodku, preukazu ŤZP či inou administratívou, ktorá sa môže
          vyskytnúť počas vašej liečby.
        </p>
      </motion.div>

      <div className="rounded-[2rem] bg-white border border-[#FDA4C7]/15 p-6 md:p-8">
        <h3 className="text-lg font-black text-[#6F2380] mb-5">
          Najčastejšie otázky, na ktoré odpovedáme:
        </h3>
        <ul className="flex flex-col gap-4">
          {OTAZKY.map((q, i) => (
            <motion.li
              key={q}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex items-start gap-3"
            >
              <HelpCircle size={18} className="text-[#FDA4C7] shrink-0 mt-0.5" strokeWidth={2} />
              <span className="text-[#6F2380]/75 text-[15px] leading-relaxed">{q}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      </div>
    </section>
  );
}
