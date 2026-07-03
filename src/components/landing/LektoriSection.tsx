"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import { ExpandableText } from "@/components/landing/ExpandableText";

const LEKTORI = [
  {
    img: "[IMG-07]",
    meno: "MUDr. Miroslava Malejčíková",
    titul: "Národný onkologický ústav",
    bio: "Vyhľadávaná klinická onkologička v prsníkovej ambulancii s mimoriadne empatickým a trpezlivým prístupom k pacientom. Vo svojej praxi kladie dôraz na hlboký rešpekt k človeku, vďaka čomu pacienti pod jej starostlivosťou nachádzajú nielen špičkovú odbornú liečbu, ale aj ľudskú oporu a dôstojné sprevádzanie počas celej liečby.",
    accent: "#6F2380",
  },
  {
    img: "[IMG-08]",
    meno: "Zuzana Mičúchová",
    titul: "kvalifikovaná lektorka Relational Mindfulness Training",
    bio: "Osobná skúsenosť s onkologickou diagnózou ju naučila, ako dýchanie, meditácia a bdelé vedomie môžu pomôcť pri zvládaní psychických aj fyzických nárokov ochorenia. Ako hovorí, techniky mindfulness jej zmenili život a umožnili znovuobjaviť vnútorný pokoj, ktorý dnes pomáha nájsť ďalším pacientom s podobným príbehom.",
    accent: "#FDA4C7",
  },
  {
    img: "[IMG-06]",
    meno: "Petra Hlaváčová",
    titul: "lektorka jogy so zameraním na onkologických pacientov",
    bio: "S empatiou a pochopením vedie jemnú onko-jogu zameranú na mobilitu a posilnenie dýchacieho systému. Jej cvičenia prinášajú pocit ľahkosti, pokoja a obnovy energie, ktorú je možné následne jednoducho zaradiť do každodenného života.",
    accent: "#FDA4C7",
  },
];

export function LektoriSection() {
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
          Naši lektori
        </p>
        <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1] mb-4">
          Odborníci a lektori, ktorým môžete dôverovať
        </h2>
        <ExpandableText maxHeight={80} fadeColor="#FFF3F9">
          <p className="text-[#6F2380]/65 text-base leading-relaxed">
            Obsah v ONKO KLUBE nevzniká anonymne. Za každým videom, podcastom
            či prednáškou stojí konkrétny odborník či lektor s overenými
            skúsenosťami.
          </p>
        </ExpandableText>
      </motion.div>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
        {LEKTORI.map((l, i) => (
          <motion.div
            key={l.meno}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex gap-4 items-start md:flex-col"
          >
            {/* Foto placeholder */}
            <div
              className="w-20 h-20 rounded-2xl shrink-0 flex items-center justify-center md:w-full md:h-48 md:rounded-3xl"
              style={{ backgroundColor: l.accent + "25" }}
            >
              {/* [IMG] profilová fotka */}
              <User size={28} style={{ color: l.accent + "80" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[#6F2380] text-[16px] leading-tight">{l.meno}</p>
              <p
                className="text-xs font-bold mb-2 mt-0.5"
                style={{ color: l.accent }}
              >
                {l.titul}
              </p>
              <ExpandableText maxHeight={70} fadeColor="#FFF3F9">
                <p className="text-[#6F2380]/55 text-[12px] leading-relaxed">{l.bio}</p>
              </ExpandableText>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-[#6F2380]/40 text-sm text-center mt-8 leading-relaxed">
        A ďalší odborníci a sprievodcovia z oblasti medicíny, pohybovej terapie,
        rehabilitácie, psychológie, výživy a sociálneho poradenstva.
      </p>
      </div>
    </section>
  );
}
