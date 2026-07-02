"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const CITATY = [
  {
    text: "Po začiatku liečby som mala pocit, že moje telo už nie je „moje“. Na onko-jogu s Peťou som prišla skôr zo zvedavosti než s očakávaním. Jemné pohyby a dýchanie pod kontrolou mi prvýkrát po dlhom čase dovolili cítiť sa v tele pokojne. Nikto odo mňa nič nechcel, nič som nemusela zvládať. Odchádzala som s pocitom, že som sa aspoň na chvíľu mohla nadýchnuť.",
    meno: "Marta, 47 rokov",
    mesto: "Bratislava",
    accent: "#FDA4C7",
  },
  {
    text: "Najťažšie pre mňa nebola samotná liečba, ale ten chaos okolo papierov a všetkých povinností, ktoré som musela riešiť. Nevedela som, kde začať, ani na čo mám ako onkologická pacientka nárok. Vďaka ONKO KLUBU som získala jasný prehľad a konkrétne usmernenie, kde začať.",
    meno: "Jana, 52 rokov",
    mesto: "Nitra",
    accent: "#6F2380",
  },
  {
    text: "Najviac mi pomohli rozhovory s pacientskymi poradcami z organizácie NIE RAKOVINE, ktorí si sami prešli liečbou. Nepodávali teórie, ale reálne skúsenosti, čo funguje, čo čakať a ako si pomôcť. Bolo to úprimné a bez prikrášľovania. Prvýkrát som mal pocit, že mi niekto naozaj rozumie.",
    meno: "Peter, 61 rokov",
    mesto: "Košice",
    accent: "#FDA4C7",
  },
];

export function TestimonialsSection() {
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
          Príbehy členov
        </p>
        <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1]">
          Rovnaká cesta, rôzne príbehy
        </h2>
      </motion.div>

      <div className="flex flex-col gap-5 md:grid md:grid-cols-3">
        {CITATY.map((c, i) => (
          <motion.div
            key={c.meno}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(111,35,128,0.1)" }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-[1.8rem] bg-white border border-[#FDA4C7]/15 p-6 cursor-default"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: c.accent }}
            >
              <Quote size={18} className="text-white" />
            </div>
            <p className="text-[#6F2380]/80 text-[15px] leading-relaxed italic mb-5">
              „{c.text}&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: c.accent }}
              />
              <div>
                <p className="font-black text-[#6F2380] text-[13px]">{c.meno}</p>
                <p className="text-[#6F2380]/40 text-[11px]">{c.mesto}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-[#6F2380]/30 text-[11px] text-center mt-6 leading-relaxed px-2">
        Príbehy sú ilustračné. Skutočné referencie budú doplnené po spustení platformy.
      </p>
      </div>
    </section>
  );
}
