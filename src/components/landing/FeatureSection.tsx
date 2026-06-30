"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ─── dáta ─── */

const FEATURES = [
  {
    id: "library" as const,
    title: "Kontent knižnica",
    desc: "Stovky videí od overených odborníkov — joga, mindfulness, výživa, psychika. Pozri si ich kedykoľvek, odkiaľkoľvek, vo vlastnom tempe.",
    href: "/kontent-kniznica",
  },
  {
    id: "podcasts" as const,
    title: "Odborné prednášky a podcasty",
    desc: "Pravidelné prednášky s lekármi, psychológmi a fyzioterapeutmi. Živé aj v archíve — zadarmo pre všetkých členov OnkoKlubu.",
    href: "/prednasky-podcasty",
  },
  {
    id: "events" as const,
    title: "Akcie po celom Slovensku",
    desc: "Workshopy, stretnutia a joga v Bratislave, Nitre, Košiciach aj Poprade. Rezervácia miesta jedným kliknutím priamo z platformy.",
    href: "/akcie",
  },
  {
    id: "community" as const,
    title: "Onkorumky",
    desc: "29 tematických fór kde môžeš písať anonymne alebo pod vlastným menom. Komunita, ktorá ťa pochopí bez dlhého vysvetľovania.",
    href: "/onkorumky",
  },
];

/* ─── ikony ─── */

/* 1. PLAY — kontent knižnica */
function LibraryIcon() {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      {/* 3 ripple kruhy */}
      {[0, 0.6, 1.2].map((delay) => (
        <motion.div
          key={delay}
          className="absolute inset-0 rounded-full"
          style={{ border: "2.5px solid #FDA4C7" }}
          animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay, ease: "easeOut" }}
        />
      ))}

      {/* Hlavný kruh */}
      <div className="w-[76px] h-[76px] rounded-full bg-[#FDA4C7] flex items-center justify-center z-10 shadow-lg">
        <motion.svg
          width="34" height="34" viewBox="0 0 34 34" fill="none"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Play trojuholník */}
          <motion.path
            d="M13 9L25 17L13 25V9Z"
            fill="white"
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>
    </div>
  );
}

/* 2. AUDIO BARY — prednášky & podcasty */
function PodcastIcon() {
  const heights = [0.45, 0.85, 1, 0.65, 0.35];
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <div className="w-[76px] h-[76px] rounded-full bg-[#6F2380] flex items-center justify-center shadow-lg">
        <div className="flex items-end gap-[5px]" style={{ height: 32 }}>
          {heights.map((h, i) => (
            <motion.div
              key={i}
              className="w-2.5 rounded-full bg-white"
              style={{ height: "100%", transformOrigin: "bottom" }}
              animate={{ scaleY: [h, 1, 0.15, 0.85, h] }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                delay: i * 0.13,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* 3. LOCATION PIN — akcie po Slovensku */
function EventsIcon() {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <div className="w-[76px] h-[76px] rounded-full bg-[#FDA4C7] flex items-center justify-center shadow-lg overflow-visible">
        {/* Pin */}
        <motion.svg
          width="32" height="42" viewBox="0 0 32 42" fill="none"
          style={{ marginBottom: 4 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M16 0C7.163 0 0 7.163 0 16c0 10.667 16 26 16 26S32 26.667 32 16C32 7.163 24.837 0 16 0Z"
            fill="white"
          />
          <circle cx="16" cy="15" r="6" fill="#FDA4C7" />
        </motion.svg>
      </div>

      {/* Pulsujúce kruhy pod pinom */}
      {[0, 0.55, 1.1].map((delay) => (
        <motion.div
          key={delay}
          className="absolute rounded-full"
          style={{
            width: 20,
            height: 8,
            borderRadius: "50%",
            border: "2px solid #FDA4C7",
            bottom: 18,
          }}
          animate={{ scale: [1, 3.8], opacity: [0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* 4. CHAT BUBLINY — Onkorumky */
function CommunityIcon() {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <div className="w-[76px] h-[76px] rounded-full bg-[#6F2380] flex items-center justify-center shadow-lg">
        <div className="relative w-12 h-11">
          {/* Horná bublina (pozadie) */}
          <motion.div
            className="absolute top-0 right-0 w-9 h-7 bg-white/25 rounded-2xl rounded-br-sm"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Dolná bublina (s typing dots) */}
          <motion.div
            className="absolute bottom-0 left-0 w-10 h-8 bg-white rounded-2xl rounded-bl-sm flex items-center justify-center gap-[5px]"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {[0, 0.22, 0.44].map((delay, i) => (
              <motion.div
                key={i}
                className="w-[5px] h-[5px] rounded-full bg-[#6F2380]"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.75, repeat: Infinity, delay, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const ICONS = { library: LibraryIcon, podcasts: PodcastIcon, events: EventsIcon, community: CommunityIcon };

/* ─── hlavná sekcia ─── */

export function FeatureSection() {
  return (
    <section className="pb-20">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
      {/* Nadpis + podnadpis */}
      <motion.h2
        className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1] mb-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Všetko čo potrebuješ na jednom mieste.
      </motion.h2>
      <motion.p
        className="text-[#6F2380]/65 text-base leading-relaxed mb-14 text-center max-w-xs mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        OnkoKlub nie je len platforma — je to celý ekosystém podpory.
        Pozri sa, čo na teba čaká.
      </motion.p>

      {/* 4 položky */}
      <div className="flex flex-col gap-16 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-20">
        {FEATURES.map((feature, i) => {
          const Icon = ICONS[feature.id];
          return (
            <motion.div
              key={feature.id}
              className="flex flex-col items-center text-center gap-5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: "easeOut" }}
            >
              <Icon />
              <div>
                <h3 className="text-xl font-black text-[#6F2380] mb-2">{feature.title}</h3>
                <p className="text-[#6F2380]/60 text-[15px] leading-relaxed max-w-[280px] mx-auto mb-5">
                  {feature.desc}
                </p>
                <Link
                  href={feature.href}
                  className="inline-block rounded-full border-2 border-[#FDA4C7] text-[#FDA4C7] text-sm font-bold px-6 py-2.5 hover:bg-[#FDA4C7] hover:text-white transition-colors"
                >
                  Čítať viac
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
