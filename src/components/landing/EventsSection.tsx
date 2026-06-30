"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Brain, Users, Coffee, MapPin, CheckCircle2 } from "lucide-react";

const ACTIVITIES = [
  {
    icon: Leaf,
    title: "Joga workshopy",
    desc: "Jemné cvičenie špeciálne pre onkologických pacientov. Bez nároku na kondíciu, v bezpečnom prostredí.",
    accent: "#FDA4C7",
  },
  {
    icon: Brain,
    title: "Mindfulness a meditácia",
    desc: "Skupinové sedenia zamerané na zvládanie stresu, dýchanie a prítomnosť v tele.",
    accent: "#6F2380",
  },
  {
    icon: Users,
    title: "Odborné stretnutia",
    desc: "Stretnutia s lekármi, psychológmi a špecialistami. Priestor na otázky a zdieľanie skúseností.",
    accent: "#FDA4C7",
  },
  {
    icon: Coffee,
    title: "Komunity meetupy",
    desc: "Neformálne stretnutia členov OnkoKlubu — rozhovor, káva, ľudia s podobnou skúsenosťou.",
    accent: "#6F2380",
  },
];

const REGIONS = [
  { id: "zapad",  name: "Západ",  cities: ["Bratislava", "Nitra", "Trnava"] },
  { id: "stred",  name: "Stred",  cities: ["Žilina", "B. Bystrica", "Trenčín"] },
  { id: "vychod", name: "Východ", cities: ["Košice", "Prešov", "Poprad"] },
];

export function EventsSection() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="pb-20"><div className="max-w-6xl mx-auto px-5 md:px-8">
      {/* Nadpis */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
          Po celom Slovensku
        </p>
        <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1] mb-4">
          Stretni sa s nami.
          <br />
          Aktivity vo tvojom kraji.
        </h2>
        <p className="text-[#6F2380]/65 text-base leading-relaxed mb-10">
          Workshopy, stretnutia a odborné akcie sa konajú pravidelne po celom Slovensku.
          Ako člen si rezervuješ miesto priamo z platformy — jedným kliknutím, zadarmo.
        </p>
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
              <div>
                <h3 className="font-black text-[#6F2380] text-[15px] leading-tight mb-0.5">
                  {a.title}
                </h3>
                <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{a.desc}</p>
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
            { n: "1", title: "Pozri si kalendár", desc: "Všetky nadchádzajúce akcie nájdeš v členskej sekcii filtrované podľa tvojho kraja — žiadne hľadanie, všetko na jednom mieste." },
            { n: "2", title: "Rezervuj si miesto", desc: "Jedným kliknutím — potvrdenie ti príde e-mailom a SMS pripomienka 24 hodín vopred, aby si nezabudol." },
            { n: "3", title: "Príď a spoznaj komunitu", desc: "Akcie sú pre členov zadarmo alebo so zvýhodnenou cenou. Kapacita na každom stretnutí je obmedzená, preto rezervuj vopred." },
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
        className="rounded-[2rem] bg-[#6F2380] px-6 py-8"
      >
        <h3 className="text-[1.5rem] font-black text-white leading-snug mb-3">
          Daj nám vedieť, kde si.
        </h3>
        <p className="text-white/65 text-sm leading-relaxed mb-8">
          Nechaj nám svoj email a my ťa upozorníme, keď sa bude konať akcia
          vo tvojom okolí. Žiadny spam — len skutočné akcie v tvojom kraji.
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
              className="flex flex-col gap-5"
            >
              {/* Výber oblasti */}
              <div>
                <p className="text-white/55 text-xs font-bold uppercase tracking-wider mb-3">
                  Kde sa nachádzaš?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {REGIONS.map((region) => {
                    const active = selectedRegion === region.id;
                    return (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => setSelectedRegion(region.id)}
                        className="flex flex-col items-center py-4 px-2 rounded-2xl border-2 transition-all duration-200 gap-1"
                        style={{
                          borderColor: active ? "#FDA4C7" : "rgba(255,255,255,0.12)",
                          backgroundColor: active ? "#FDA4C7" : "rgba(255,255,255,0.07)",
                        }}
                      >
                        <MapPin
                          size={16}
                          className="shrink-0"
                          style={{ color: active ? "white" : "rgba(255,255,255,0.5)" }}
                          strokeWidth={2.5}
                        />
                        <span
                          className="text-sm font-black"
                          style={{ color: active ? "white" : "rgba(255,255,255,0.8)" }}
                        >
                          {region.name}
                        </span>
                        {region.cities.slice(0, 2).map((city) => (
                          <span
                            key={city}
                            className="text-[10px] leading-tight"
                            style={{ color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)" }}
                          >
                            {city}
                          </span>
                        ))}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center mt-2.5 px-1">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/20 text-[10px] px-2">Slovensko</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              </div>

              {/* Meno */}
              <div>
                <label className="text-white/55 text-xs font-bold uppercase tracking-wider block mb-2">
                  Meno
                </label>
                <input
                  type="text"
                  placeholder="Tvoje meno"
                  required
                  className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 px-4 py-3.5 text-sm outline-none focus:border-[#FDA4C7] transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-white/55 text-xs font-bold uppercase tracking-wider block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="tvoj@email.sk"
                  required
                  className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 px-4 py-3.5 text-sm outline-none focus:border-[#FDA4C7] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#FDA4C7] text-white font-black text-base py-4 mt-1 active:scale-[0.98] transition-transform"
              >
                Chcem byť informovaný o akciách
              </button>

              <p className="text-white/25 text-[11px] text-center leading-relaxed">
                Žiadny spam. Odhlásenie kedykoľvek jedným klikom.
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
