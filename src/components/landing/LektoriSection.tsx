"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

const LEKTORI = [
  {
    img: "[IMG-06]",
    meno: "Petra Joga",
    titul: "Joga pre onkologických pacientov",
    bio: "Petra vedie workshopy jogy špeciálne prispôsobené pre onkologických pacientov a ľudí po liečbe. Zameriava sa na jemný pohyb, dýchanie a regeneráciu tela — bez nároku na fyzickú kondíciu. V OnkoKlube vedie live workshopy, nahrávkové série a krátke cvičenia prístupné aj z postele.",
    accent: "#FDA4C7",
  },
  {
    img: "[IMG-07]",
    meno: "Mirka Malejčíková",
    titul: "Mindfulness & psychosociálna podpora",
    bio: "Mirka je odborníčka na mindfulness s osobnou aj odbornou skúsenosťou s kurzom MBSR. Hovorí z vlastnej skúsenosti aj z pozície odborníčky — čo jej dáva autentický, dôveryhodný hlas pre onkologickú komunitu. V OnkoKlube vedie prednášky, webináre a rozhovory o prepojení psychiky, pohybu a liečby.",
    accent: "#6F2380",
  },
  {
    img: "[IMG-08]",
    meno: "Zuzka Mindfulness",
    titul: "Mindfulness & relaxačné techniky",
    bio: "Bio bude doplnené po dodaní podkladov od NIE RAKOVINE.",
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
          Tváre, ktorým
          <br />
          môžeš dôverovať.
        </h2>
        <p className="text-[#6F2380]/65 text-base leading-relaxed">
          Obsah v OnkoKlube netvorí nikto anonymný. Za každým videom, prednáškou
          a kurzom stojí konkrétny odborník — s menom, tvárou a overenými skúsenosťami.
        </p>
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
              <p className="text-[#6F2380]/55 text-[12px] leading-relaxed">{l.bio}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-[#6F2380]/40 text-sm text-center mt-8 leading-relaxed">
        A ďalší odborníci, ktorí sa k OnkoKlubu pridávajú — lekári, fyzioterapeuti,
        psychológovia, nutričné poradkyne a ďalší.
      </p>
      </div>
    </section>
  );
}
