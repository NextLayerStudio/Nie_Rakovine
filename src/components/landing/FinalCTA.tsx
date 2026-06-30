"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="pb-16"><div className="max-w-6xl mx-auto px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65 }}
        className="rounded-[2rem] bg-[#6F2380] px-6 py-12 text-center relative overflow-hidden"
      >
        {/* dekoratívne animované blobky */}
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-14 -right-14 w-56 h-56 rounded-full bg-white"
        />
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#FDA4C7]"
        />

        <div className="relative z-10">
          <h2 className="text-[2.4rem] font-black text-white leading-[1.1] mb-4">
            Prvý krok stačí.
          </h2>
          <p className="text-white/65 text-base leading-relaxed mb-8 max-w-xs mx-auto">
            Registrácia trvá 2 minúty. Bez záväzkov — prvý mesiac môžeš
            vyskúšať a kedykoľvek odísť.
          </p>
          <Link
            href="/register"
            className="block w-full rounded-full bg-[#FDA4C7] text-white font-black text-xl py-5 text-center active:scale-[0.98] transition-transform mb-4"
          >
            Chcem sa pripojiť
          </Link>
          <Link href="/login" className="text-white/40 text-sm underline underline-offset-2">
            Už som člen — Prihlásiť sa
          </Link>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
