"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } };

export function HeroSection() {
  return (
    <>
      <section className="pt-24 md:pt-32 pb-10 md:pb-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          {/* Blobs */}
          <motion.div aria-hidden animate={{ x: [0,18,0], y: [0,-14,0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: "#FDA4C7", opacity: 0.18 }} />
          <motion.div aria-hidden animate={{ x: [0,-12,0], y: [0,16,0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="pointer-events-none absolute top-32 -left-20 w-72 h-72 rounded-full blur-3xl"
            style={{ backgroundColor: "#6F2380", opacity: 0.08 }} />

          {/* Desktop: 2 stĺpce, Mobile: 1 stĺpec (nadpis -> krátky úvod -> foto -> CTA -> zvyšok textu) */}
          <div className="relative z-10 md:grid md:grid-cols-2 md:gap-16 md:items-center">
            {/* Text */}
            <motion.div variants={stagger} initial="hidden" animate="show">
              <motion.h1 variants={fadeUp} className="text-[2.6rem] md:text-[3.4rem] lg:text-[4rem] font-black text-[#6F2380] leading-[1.1] mb-4">
                Vieme, čím si prechádzate
              </motion.h1>

              <motion.div variants={fadeUp} className="mb-6 max-w-sm md:mb-8 md:max-w-none">
                <p className="text-[#6F2380]/70 text-base md:text-lg leading-relaxed">
                  Vitajte v ONKO KLUBE – bezpečnom priestore pre pacientov s onkologickým
                  ochorením a ich blízkych.
                  {/* Na desktope pokračuje rovnaký odsek, na mobile ide až po foto a CTA nižšie */}
                  <span className="hidden md:inline">
                    {" "}Overený obsah, odborné videá, diskusné fóra, podcasty, praktické
                    rady, workshopy aj výhody pre členov. ONKO KLUB stojí na tíme desiatok
                    odborníkov, lektorov a pacientskych poradcov s osobnou skúsenosťou s
                    rakovinou. Jeho skutočnú hodnotu však tvoria samotní členovia – ľudia,
                    ktorí si prechádzajú podobnou cestou a rozumejú aj tichým obavám,
                    ktoré si v ťažkých chvíľach nechávame iba pre seba.
                  </span>
                </p>
              </motion.div>

              {/* Foto — len na mobile, tu medzi krátkym úvodom a CTA */}
              <motion.div variants={fadeUp} className="mb-6 flex justify-center md:hidden">
                <div className="relative mx-auto w-full max-w-[360px] p-3">
                  {/* ružové pozadie (rovnaká farba ako v hero sekcii), mierne pootočené */}
                  <div
                    aria-hidden
                    className="absolute inset-3 rounded-[2rem] bg-[#FDA4C7]"
                    style={{ transform: "rotate(-4deg) translate(3%, 3%)" }}
                  />
                  <div
                    className="relative overflow-hidden rounded-[2rem] shadow-[0_14px_34px_-10px_rgba(111,35,128,0.35)]"
                    style={{ aspectRatio: "1024 / 656", transform: "rotate(3deg)" }}
                  >
                    <Image
                      src="/images/hero-komunita.png"
                      alt="OnkoKlub komunita"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-3 mb-4">
                <Link href="/register" className="inline-block rounded-full bg-[#FDA4C7] text-white text-base font-black px-8 py-4">
                  Chcem sa pripojiť
                </Link>
                <Link href="/co-ziskas" className="inline-block rounded-full border-2 border-[#FDA4C7] text-[#FDA4C7] text-base font-black px-8 py-4">
                  Čo získam?
                </Link>
              </motion.div>

              {/* Zvyšok textu — len na mobile, až po CTA */}
              <motion.div variants={fadeUp} className="max-w-sm md:hidden">
                <p className="text-[#6F2380]/70 text-base leading-relaxed">
                  Overený obsah, odborné videá, diskusné fóra, podcasty, praktické
                  rady, workshopy aj výhody pre členov. ONKO KLUB stojí na tíme desiatok
                  odborníkov, lektorov a pacientskych poradcov s osobnou skúsenosťou s
                  rakovinou. Jeho skutočnú hodnotu však tvoria samotní členovia – ľudia,
                  ktorí si prechádzajú podobnou cestou a rozumejú aj tichým obavám,
                  ktoré si v ťažkých chvíľach nechávame iba pre seba.
                </p>
              </motion.div>
            </motion.div>

            {/* Foto — na desktope vpravo (na mobile sa zobrazuje vyššie, medzi úvodom a CTA) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease }}
              className="hidden justify-center md:flex"
            >
              <div
                className="relative mx-auto w-full max-w-[480px] overflow-hidden rounded-[2rem] lg:max-w-[540px]"
                style={{ aspectRatio: "1024 / 656" }}
              >
                <Image
                  src="/images/hero-komunita.png"
                  alt="OnkoKlub komunita"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
