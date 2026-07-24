"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Krátky fotografický medzikrok pred sekciou "Nie ste v tom sami". */
export function CommunityPhotoSection() {
  return (
    <section className="pb-8 md:pb-12">
      {/* Mobile: fotka mierne vytŕča za pravý okraj obrazovky, asymetricky pootočená */}
      <div className="md:hidden">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease }}
          className="relative -mr-5 ml-12"
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
