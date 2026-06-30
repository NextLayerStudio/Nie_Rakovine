"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ChevronRight, Circle } from "lucide-react";

const CATEGORIES = [
  {
    label: "Podľa diagnózy",
    accent: "#FDA4C7",
    items: ["Rakovina prsníka", "Rakovina hrubého čreva", "Rakovina pľúc", "Rakovina prostaty", "Melanóm", "a ďalšie…"],
  },
  {
    label: "Podľa témy",
    accent: "#6F2380",
    items: ["Psychická podpora", "Výživa a pohyb", "Nežiaduce účinky liečby", "Sociálne dávky", "Návrat do práce"],
  },
  {
    label: "Podľa liečby",
    accent: "#FDA4C7",
    items: ["Chemoterapia", "Rádioterapia", "Imunoterapia", "Hormonálna liečba", "Cielená liečba"],
  },
];

const SAMPLE_POSTS = [
  {
    forum: "Psychická podpora",
    time: "pred 2 hodinami",
    replies: 8,
    text: "Mám pocit, že všetci okolo mňa hovoria, aby som bola pozitívna — a ja neviem, ako to mám robiť. Je to v poriadku?",
    anon: true,
  },
  {
    forum: "Nežiaduce účinky liečby",
    time: "pred 5 hodinami",
    replies: 12,
    text: "Po druhej chémii mi vypadli vlasy. Neviete, kde zohnať dobrú parochňu, ktorú čiastočne hradí poisťovňa?",
    anon: false,
  },
  {
    forum: "Rakovina prsníka",
    time: "včera",
    replies: 24,
    text: "Práve som sa dozvedela výsledky. Neviem čo ďalej. Môžem sa tu niekoho opýtať na skúsenosti s liečbou v UN Bratislava?",
    anon: true,
  },
];

export function OnkorumkySection() {
  return (
    <section className="pb-20"><div className="max-w-6xl mx-auto px-5 md:px-8">
      {/* Nadpis */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
          Onkorumky
        </p>
        <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1] mb-4">
          Komunita,
          <br />
          ktorá rozumie
          <br />
          bez slov.
        </h2>
        <p className="text-[#6F2380]/65 text-base leading-relaxed">
          V Onkorumky fórach sa každý deň stretávajú ľudia, ktorí prešli alebo
          prechádzajú tým, čím si prechádzaš ty. Môžeš písať pod vlastným menom alebo
          anonymne — vždy v bezpečnom, moderovanom prostredí.
        </p>
      </motion.div>

      {/* Placeholder — screenshot fóra (1) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
        className="mb-10"
      >
        <div className="w-full aspect-[9/16] max-h-[480px] rounded-[2rem] overflow-hidden rotate-1">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/c0408.mp4" type="video/mp4" />
          </video>
        </div>
      </motion.div>

      {/* Anonymita */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#FDA4C7]/15 mb-10"
      >
        <div className="w-11 h-11 rounded-xl bg-[#6F2380] flex items-center justify-center shrink-0">
          <Lock size={18} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-black text-[#6F2380] text-[15px] leading-tight mb-0.5">
            Anonymita je na tebe
          </h3>
          <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">
            Pri každom príspevku si vyberieš — písať pod menom alebo anonymne.
            Nikto okrem administrátora nevidí, kto si.
          </p>
        </div>
      </motion.div>

      {/* Kategórie fór */}
      <div className="mb-12">
        <h3 className="text-xl font-black text-[#6F2380] mb-7">29 fór — nájdi si svoje</h3>
        <div className="flex flex-col gap-6">
          {CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: ci * 0.08 }}
            >
              <p
                className="text-[11px] font-black uppercase tracking-widest mb-3"
                style={{ color: cat.accent }}
              >
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="text-[#6F2380] text-sm font-semibold px-4 py-2 rounded-full"
                    style={{ backgroundColor: cat.accent + "18", border: `1.5px solid ${cat.accent}30` }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ukážkové príspevky */}
      <div className="mb-10">
        <h3 className="text-xl font-black text-[#6F2380] mb-1">Záblesk z komunity</h3>
        <p className="text-[#6F2380]/40 text-xs mb-5">
          Príspevky vidíš celé len po prihlásení.
        </p>
        <div className="flex flex-col gap-3">
          {SAMPLE_POSTS.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-[#FDA4C7]/15"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#FDA4C7] text-xs font-bold">{post.forum}</span>
                <span className="text-[#6F2380]/25 text-xs">{post.time}</span>
              </div>
              <p className="text-[#6F2380]/70 text-sm leading-relaxed mb-3 italic">
                „{post.text}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <Circle size={5} className="text-[#FDA4C7] fill-[#FDA4C7]" />
                <span className="text-[#6F2380]/30 text-xs">
                  {post.anon ? "Anonymný člen" : "Člen"} · {post.replies} odpovedí
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Placeholder — screenshot fóra (2) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
        className="mb-10"
      >
        <div className="w-full aspect-[9/16] max-h-[480px] rounded-[2rem] overflow-hidden -rotate-1">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/c0397.mp4" type="video/mp4" />
          </video>
        </div>
      </motion.div>

      {/* CTA karta */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="rounded-[2rem] bg-[#6F2380] px-6 py-8"
      >
        <h3 className="text-[1.6rem] font-black text-white leading-snug mb-3">
          Nie si v tom sám.
        </h3>
        <p className="text-white/65 text-sm leading-relaxed mb-7">
          Zaregistruj sa a okamžite získaš prístup ku všetkým 29 fóram.
          Môžeš začať tým, že len čítaš — žiadny tlak.
        </p>
        <Link
          href="/onkorumky"
          className="flex items-center justify-between bg-white/10 rounded-2xl px-5 py-4 mb-3 border border-white/15 active:scale-[0.98] transition-transform"
        >
          <span className="text-white font-bold text-sm">Pozrieť si Onkorumky</span>
          <ChevronRight size={18} className="text-white/60" />
        </Link>
        <Link
          href="/register"
          className="block w-full rounded-full bg-[#FDA4C7] text-white font-black text-base py-4 text-center active:scale-[0.98] transition-transform"
        >
          Vstúpiť do komunity
        </Link>
      </motion.div>
      </div>
    </section>
  );
}
