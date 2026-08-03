"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Brain, Users, Coffee, MapPin, CheckCircle2 } from "lucide-react";
import { ExpandableText } from "@/components/landing/ExpandableText";

const ACTIVITIES = [
  {
    icon: Leaf,
    title: "Onko-joga workshopy",
    desc: "Jemné cvičenie prispôsobené potrebám onkologických pacientov. V bezpečnom a podpornom prostredí, bez ohľadu na kondíciu či predchádzajúce skúsenosti.",
    accent: "#FDA4C7",
  },
  {
    icon: Brain,
    title: "Mindfulness a meditácia",
    desc: "Skupinové stretnutia zamerané na zvládanie stresu, vedomé dýchanie, uvoľnenie a vnímanie vlastného tela.",
    accent: "#6F2380",
  },
  {
    icon: Users,
    title: "Odborné podujatia",
    desc: "Diskusie a prednášky s lekármi, psychológmi a ďalšími odborníkmi. Priestor na otázky, nové informácie a zdieľanie skúseností.",
    accent: "#FDA4C7",
  },
  {
    icon: Coffee,
    title: "Podporné stretnutia",
    desc: "Neformálne stretnutia členov ONKO KLUBU – priestor na rozhovory, vzájomnú podporu a spájanie ľudí s podobnou životnou skúsenosťou.",
    accent: "#6F2380",
  },
];

const REGIONS = [
  { id: "zapad",  name: "Západné Slovensko",  cities: ["Bratislava", "Nitra", "Trnava"] },
  { id: "stred",  name: "Stredné Slovensko",  cities: ["Žilina", "B. Bystrica", "Trenčín"] },
  { id: "vychod", name: "Východné Slovensko", cities: ["Košice", "Prešov", "Poprad"] },
];

export function EventsSection() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="pb-14"><div className="max-w-6xl mx-auto px-5 md:px-8">
      {/* Nadpis */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
          Podujatia po celom Slovensku
        </p>
        <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1] mb-4">
          Príďte načerpať podporu a nové skúsenosti
        </h2>
        <div className="mb-10">
          <ExpandableText maxHeight={80} fadeColor="#FFF3F9">
            <p className="text-[#6F2380]/65 text-base leading-relaxed">
              Workshopy, skupinové stretnutia a odborné podujatia sú dostupné vo viacerých
              regiónoch Slovenska. Ako člen/ka ONKO KLUBU máte možnosť prihlásiť sa na
              vybrané aktivity jednoducho priamo v aplikácii ONKO KLUB.
            </p>
          </ExpandableText>
        </div>
      </motion.div>

      {/* Typy aktivít */}
      <div className="flex flex-col gap-3 mb-14">
        {ACTIVITIES.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#FDA4C7]/15"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: a.accent }}
              >
                <Icon size={18} className="text-white" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-[#6F2380] text-[15px] leading-tight mb-0.5">
                  {a.title}
                </h3>
                <ExpandableText maxHeight={56} fadeColor="#FFFFFF">
                  <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{a.desc}</p>
                </ExpandableText>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Ako to funguje — cestička */}
      <div className="mb-14">
        <h3 className="text-xl font-black text-[#6F2380] mb-8">Ako to funguje</h3>
        <div className="relative pl-5">
          {/* zvislá čiara */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ originY: 0 }}
            className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-[#FDA4C7] via-[#FDA4C7]/50 to-transparent"
          />

          {[
            { n: "1", title: "Vyberte si podujatie", desc: "V členskej sekcii nájdete prehľad pripravovaných workshopov, stretnutí a podujatí z celého Slovenska, prehľadne usporiadaných podľa regiónov." },
            { n: "2", title: "Prihláste sa online", desc: "Svoje miesto si rezervujete jednoducho priamo v aplikácii ONKO KLUB. Po registrácii vám zašleme potvrdenie a včas vám pripomenieme termín podujatia." },
            { n: "3", title: "Stretnite ľudí, ktorí vám rozumejú", desc: "Podujatia sú určené členom ONKO KLUBU a mnohé z nich sú bezplatné alebo za zvýhodnených podmienok. Počet miest býva obmedzený, preto odporúčame prihlásiť sa vopred." },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.15 }}
              className="relative flex gap-5 items-start pb-8 last:pb-0"
            >
              {/* bod na cestičke */}
              <div className="relative z-10 w-10 h-10 rounded-full bg-[#FDA4C7] flex items-center justify-center shrink-0 shadow-[0_0_0_4px_#FFF3F9]">
                <span className="text-white font-black text-base leading-none">{s.n}</span>
              </div>
              <div className="pt-1.5">
                <p className="font-black text-[#6F2380] text-[17px] mb-1">{s.title}</p>
                <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Kontaktný formulár */}
      <div className="md:max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65 }}
        className="rounded-3xl bg-[#6F2380] px-5 py-6"
      >
        <h3 className="text-xl font-black text-white leading-snug mb-2">
          Nezmeškajte podujatia vo vašom okolí
        </h3>
        <p className="text-white/65 text-sm leading-relaxed mb-5">
          Vyberte región a zanechajte kontakt — dáme vám vedieť o podujatiach
          vo vašom okolí.
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-6 gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#FDA4C7] flex items-center justify-center">
                <CheckCircle2 size={32} className="text-white" />
              </div>
              <p className="text-white font-black text-xl">Ďakujeme!</p>
              <p className="text-white/65 text-sm">
                Dáme ti vedieť, keď bude niečo vo tvojom kraji.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="flex flex-col gap-3.5"
            >
              {/* Výber oblasti */}
              <div className="grid grid-cols-3 gap-2">
                {REGIONS.map((region) => {
                  const active = selectedRegion === region.id;
                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => setSelectedRegion(region.id)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full border transition-colors duration-200"
                      style={{
                        borderColor: active ? "#FDA4C7" : "rgba(255,255,255,0.15)",
                        backgroundColor: active ? "#FDA4C7" : "rgba(255,255,255,0.07)",
                      }}
                    >
                      <MapPin
                        size={13}
                        className="shrink-0"
                        style={{ color: active ? "white" : "rgba(255,255,255,0.5)" }}
                        strokeWidth={2.5}
                      />
                      <span
                        className="text-xs font-bold leading-tight"
                        style={{ color: active ? "white" : "rgba(255,255,255,0.8)" }}
                      >
                        {region.name.replace(" Slovensko", "")}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Meno + Email */}
              <input
                type="text"
                placeholder="Tvoje meno"
                required
                className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 px-4 py-3 text-sm outline-none focus:border-[#FDA4C7] transition-colors"
              />
              <input
                type="email"
                placeholder="tvoj@email.sk"
                required
                className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 px-4 py-3 text-sm outline-none focus:border-[#FDA4C7] transition-colors"
              />

              <button
                type="submit"
                className="w-full rounded-full bg-[#FDA4C7] text-white font-black text-sm py-3.5 mt-1 active:scale-[0.98] transition-transform"
              >
                Chcem vedieť o podujatiach v okolí
              </button>

              <p className="text-white/25 text-[10px] text-center leading-relaxed">
                Odber môžete kedykoľvek zrušiť.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
      </div>
    </section>
  );
}
