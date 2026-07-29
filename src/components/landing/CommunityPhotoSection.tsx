"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Krátky fotografický medzikrok pred sekciou "Nie ste v tom sami". */
export function CommunityPhotoSection() {
  return (
    <section className="pb-8 md:pb-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease }}
        className="flex items-center justify-center px-5 text-center text-[2rem] md:text-[2.6rem] font-black leading-[1.1] text-[#6F2380] mb-8 md:mb-10"
      >
        <span className="relative z-10">Komunita je naše</span>
        <span
          className="relative z-0 -ml-5 mr-1 inline-block h-[2em] w-[2em] shrink-0 md:-ml-7 md:mr-2 md:h-[2.4em] md:w-[2.4em]"
          style={{ transform: "rotate(-14deg)" }}
        >
          <Image src="/images/srdce-komunita.png" alt="srdce" fill className="object-contain" />
        </span>
        <span className="relative z-10">srdce</span>
      </motion.h2>

      {/* Mobile: fotka na strede, mierne pootočená (roh "vytŕča" vďaka náklonu) */}
      <div className="md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease }}
          className="relative mx-auto w-[85%]"
          style={{ transform: "rotate(-3deg)" }}
        >
          <div
            className="relative overflow-hidden rounded-[1.75rem] shadow-[0_16px_40px_-12px_rgba(111,35,128,0.4)]"
            style={{ aspectRatio: "1200 / 801" }}
          >
            <Image
              src="/images/komunita-hrdlicka.jpg"
              alt="Komunita ONKO KLUB"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Desktop: jednoduché centrované foto, bez pootočenia */}
      <div className="hidden md:block max-w-6xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease }}
          className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] shadow-card"
          style={{ aspectRatio: "1200 / 801" }}
        >
          <Image
            src="/images/komunita-hrdlicka.jpg"
            alt="Komunita ONKO KLUB"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
