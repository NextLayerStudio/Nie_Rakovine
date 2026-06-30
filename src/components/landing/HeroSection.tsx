"use client";

import Link from "next/link";
import Image from "next/image";
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

          {/* Desktop: 2 stĺpce, Mobile: 1 stĺpec */}
          <div className="relative z-10 md:grid md:grid-cols-2 md:gap-16 md:items-center">
            {/* Text */}
            <motion.div variants={stagger} initial="hidden" animate="show">
              <motion.p variants={fadeUp} className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
                Uzavretá platforma · NIE RAKOVINE, o. z.
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-[2.6rem] md:text-[3.4rem] lg:text-[4rem] font-black text-[#6F2380] leading-[1.1] mb-4">
                Komunita, ktorá vie, čím si prechádzaš.
              </motion.h1>
              <motion.p variants={fadeUp} className="text-[#6F2380]/70 text-base md:text-lg leading-relaxed mb-8 max-w-sm md:max-w-none">
                OnkoKlub je uzavretá platforma pre onkologických pacientov a ich blízkych.
                Videá, odborníci, podcasty, workshopy po celom Slovensku, zľavy od overených
                značiek a komunita ľudí, ktorí to žijú rovnako ako ty — všetko na jednom mieste.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-3 mb-4">
                <Link href="/register" className="inline-block rounded-full bg-[#FDA4C7] text-white text-base font-black px-8 py-4">
                  Chcem sa pripojiť
                </Link>
                <Link href="/co-ziskas" className="inline-block rounded-full border-2 border-[#FDA4C7] text-[#FDA4C7] text-base font-black px-8 py-4">
                  Čo získam?
                </Link>
              </motion.div>
              <motion.p variants={fadeUp} className="text-[#6F2380]/40 text-[13px]">
                Členstvo od 5 € / mesiac · prvý mesiac môžeš vyskúšať a kedykoľvek odísť.
              </motion.p>
            </motion.div>

            {/* Foto — na mobile pod textom, na desktop vpravo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease }}
              className="mt-10 md:mt-0 flex justify-center"
            >
              <div className="relative w-full max-w-[340px] md:max-w-none" style={{ aspectRatio: "3/4" }}>
                {/* Pozadie — fialový štvorec, otočený */}
                <motion.div
                  animate={{ y: [0,-8,0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-[2rem] bg-[#6F2380]/25"
                  style={{ rotate: "-4deg" }}
                />
                {/* Fotka — o niečo menšia, na vrchu */}
                <motion.div
                  animate={{ y: [0,-8,0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute rounded-[2rem] overflow-hidden"
                  style={{ inset: "5%", rotate: "-4deg" }}
                >
                  <Image
                    src="/images/hero-komunita.jpg"
                    alt="Komunita OnkoKlub — ženy sa objímajú"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
