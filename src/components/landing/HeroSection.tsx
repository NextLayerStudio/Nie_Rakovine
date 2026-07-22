"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } };

export function HeroSection() {
  return (
    <section className="pt-20 md:pt-24 pb-10 md:pb-16">
      {/* Video na celú šírku ako pozadie nadpisu/úvodu/CTA - kontajner nemá pevnú
          výšku, video ju len vyplní, takže končí presne tam, kde končí posledné
          tlačidlo. Platí na mobile aj na desktope. */}
      <div className="relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-komunita.png"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/onko-klub-intro.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/50" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-8 md:pt-24 md:pb-16"
        >
          <div className="max-w-xl">
            <motion.h1 variants={fadeUp} className="text-[2.6rem] md:text-[3.4rem] lg:text-[4rem] font-black text-white leading-[1.1] mb-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
              Vieme, čím si prechádzate
            </motion.h1>

            <motion.div variants={fadeUp} className="mb-6 md:mb-8 max-w-sm md:max-w-lg">
              <p className="text-white text-lg md:text-xl font-bold leading-relaxed [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
                Vitajte v ONKO KLUBE – bezpečnom priestore pre pacientov s onkologickým
                ochorením a ich blízkych.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-3">
              <Link href="/register" className="inline-block rounded-full bg-[#FDA4C7] text-white text-base font-black px-8 py-4 shadow-lg">
                Chcem sa pripojiť
              </Link>
              <Link href="/co-ziskas" className="inline-block rounded-full border-2 border-[#FDA4C7] bg-white/90 text-[#FDA4C7] text-base font-black px-8 py-4 shadow-lg">
                Čo získam?
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Zvyšok textu — pod videom, na normálnom pozadí stránky */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 mt-6">
        <p className="text-[#6F2380]/70 text-base md:text-lg leading-relaxed max-w-sm md:max-w-2xl">
          Overený obsah, odborné videá, diskusné fóra, podcasty, praktické
          rady, workshopy aj výhody pre členov. ONKO KLUB stojí na tíme desiatok
          odborníkov, lektorov a pacientskych poradcov s osobnou skúsenosťou s
          rakovinou. Jeho skutočnú hodnotu však tvoria samotní členovia – ľudia,
          ktorí si prechádzajú podobnou cestou a rozumejú aj tichým obavám,
          ktoré si v ťažkých chvíľach nechávame iba pre seba.
        </p>
      </div>
    </section>
  );
}
