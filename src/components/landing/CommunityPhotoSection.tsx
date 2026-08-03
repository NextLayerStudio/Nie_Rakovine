"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Krátky fotografický medzikrok pred sekciou "Nie ste v tom sami". */
export function CommunityPhotoSection() {
  return (
    <section className="pt-8 md:pt-14 pb-6 md:pb-8">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8 md:mb-10"
        >
          <span className="relative shrink-0 h-28 w-28 rotate-[-14deg] md:h-40 md:w-40">
            <Image src="/images/srdce-komunita.png" alt="srdce" fill className="object-contain" />
          </span>
          <h2 className="text-[2.6rem] md:text-[5rem] font-black leading-[1.02] text-[#6F2380]">
            Komunita je naše srdce
          </h2>
        </motion.div>
      </div>

      {/* Mobile: fotka na strede, mierne pootočená (roh "vytŕča" vďaka náklonu) */}
      <div className="md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease }}
          className="relative mx-auto -mt-14 w-[85%]"
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
    </section>
  );
}
