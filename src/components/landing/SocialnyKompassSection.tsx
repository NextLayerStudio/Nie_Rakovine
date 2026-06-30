"use client";

import { motion } from "framer-motion";
import { Shield, Wallet, FileText, Gift, Briefcase, HeartHandshake } from "lucide-react";

const TEMY = [
  {
    icon: Shield,
    accent: "#FDA4C7",
    title: "Práva pacienta",
    desc: "Čo máš právo požadovať od lekárov, nemocníc a zdravotných poisťovní. Prehľadne, bez právnického žargónu.",
  },
  {
    icon: Wallet,
    accent: "#6F2380",
    title: "Invalidný dôchodok",
    desc: "Kedy naň máš nárok, ako podať žiadosť, čo všetko treba doložiť a ako dlho to trvá. Krok za krokom.",
  },
  {
    icon: FileText,
    accent: "#FDA4C7",
    title: "PN a pracovná neschopnosť",
    desc: "Ako dlho môžeš byť na PN, čo dostaneš vyplatené a aké máš povinnosti voči zamestnávateľovi.",
  },
  {
    icon: Gift,
    accent: "#6F2380",
    title: "Príspevky a dávky",
    desc: "Prehľad všetkých príspevkov a dávok, na ktoré máš ako onkologický pacient nárok — zo Sociálnej poisťovne aj od štátu.",
  },
  {
    icon: Briefcase,
    accent: "#FDA4C7",
    title: "Návrat do práce",
    desc: "Právne informácie o návrate do zamestnania — tvoje práva, povinnosti zamestnávateľa a ako komunikovať o svojom zdravotnom stave.",
  },
  {
    icon: HeartHandshake,
    accent: "#6F2380",
    title: "Sociálna pomoc",
    desc: "Kde hľadať pomoc keď to nestačí — neziskové organizácie, poradne, linky pomoci a komunitná podpora na Slovensku.",
  },
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
          Vieme, že to nie je
          <br />
          len o zdraví.
        </h2>
        <p className="text-[#6F2380]/65 text-base leading-relaxed">
          Onkologická diagnóza so sebou prináša aj množstvo praktických otázok, na ktoré
          nik nemá čas ani energiu hľadať odpovede. PN, invalidita, príspevky, práva
          pacienta, návrat do práce — to všetko je súčasť tvojej každodennej reality.
          V OnkoKlube nájdeš Sociálny kompas — prehľadný sprievodca, ktorý ťa všetkým
          prevedie.
        </p>
      </motion.div>

      <div className="relative pl-5">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          style={{ originY: 0 }}
          className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-[#FDA4C7] via-[#6F2380]/40 to-transparent"
        />

        {TEMY.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative flex gap-5 items-start pb-8 last:pb-0"
            >
              <div
                className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_#FFF3F9]"
                style={{ backgroundColor: t.accent }}
              >
                <Icon size={17} className="text-white" strokeWidth={2} />
              </div>
              <div className="pt-1.5">
                <p className="font-black text-[#6F2380] text-[16px] mb-1">{t.title}</p>
                <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{t.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
