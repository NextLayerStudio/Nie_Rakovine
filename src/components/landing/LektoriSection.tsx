"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExpandableText } from "@/components/landing/ExpandableText";

const LEKTORI = [
  {
    img: "/images/lektori/malejcikova.jpg",
    imgPosition: "object-top",
    meno: "MUDr. Miroslava Malejčíková",
    titul: "Národný onkologický ústav",
    bio: "Vyhľadávaná klinická onkologička v prsníkovej ambulancii s mimoriadne empatickým a trpezlivým prístupom k pacientom. Vo svojej praxi kladie dôraz na hlboký rešpekt k človeku, vďaka čomu pacienti pod jej starostlivosťou nachádzajú nielen špičkovú odbornú liečbu, ale aj ľudskú oporu a dôstojné sprevádzanie počas celej liečby.",
    accent: "#6F2380",
  },
  {
    img: "/images/lektori/micuchova.jpg",
    imgPosition: "object-top",
    meno: "Zuzana Mičúchová",
    titul: "kvalifikovaná lektorka Relational Mindfulness Training",
    bio: "Osobná skúsenosť s onkologickou diagnózou ju naučila, ako dýchanie, meditácia a bdelé vedomie môžu pomôcť pri zvládaní psychických aj fyzických nárokov ochorenia. Ako hovorí, techniky mindfulness jej zmenili život a umožnili znovuobjaviť vnútorný pokoj, ktorý dnes pomáha nájsť ďalším pacientom s podobným príbehom.",
    accent: "#FDA4C7",
  },
  {
    img: "/images/lektori/hlavacova.jpg",
    imgPosition: "object-center",
    meno: "Petra Hlaváčová",
    titul: "lektorka jogy so zameraním na onkologických pacientov",
    bio: "S empatiou a pochopením vedie jemnú onko-jogu zameranú na mobilitu a posilnenie dýchacieho systému. Jej cvičenia prinášajú pocit ľahkosti, pokoja a obnovy energie, ktorú je možné následne jednoducho zaradiť do každodenného života.",
    accent: "#FDA4C7",
  },
  {
    img: "/images/lektori/jessica.jpg",
    imgPosition: "object-top",
    meno: "Jessica",
    titul: "",
    bio: "",
    accent: "#6F2380",
  },
  {
    img: "/images/lektori/viktor-oliva.jpg",
    imgPosition: "object-top",
    meno: "Viktor Oliva",
    titul: "",
    bio: "",
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

      <div className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 md:-mx-8 md:px-8">
        {LEKTORI.map((l, i) => (
          <motion.div
            key={l.meno}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="w-[220px] md:w-[280px] shrink-0 snap-start"
          >
            <div className="relative w-full h-56 md:h-64 rounded-3xl shrink-0 overflow-hidden">
              <Image
                src={l.img}
                alt={l.meno}
                fill
                sizes="280px"
                className={`object-cover ${l.imgPosition}`}
              />
            </div>
            <div className="mt-3">
              <p className="font-black text-[#6F2380] text-[16px] leading-tight">{l.meno}</p>
              {l.titul && (
                <p
                  className="text-xs font-bold mb-2 mt-0.5"
                  style={{ color: l.accent }}
                >
                  {l.titul}
                </p>
              )}
              {l.bio && (
                <ExpandableText maxHeight={70} fadeColor="#FFF3F9">
                  <p className="text-[#6F2380]/55 text-[12px] leading-relaxed">{l.bio}</p>
                </ExpandableText>
              )}
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
