"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function NieSiVTomSamSection() {
  return (
    <section className="pb-16">
      <div className="max-w-6xl mx-auto px-5 md:px-8 md:max-w-4xl">
        <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease }}
          >
            <h2 className="text-[2.2rem] md:text-[2.8rem] font-black text-[#6F2380] leading-[1.1] mb-4">
              Nie si v tom sám.
            </h2>
            <p className="text-[#6F2380]/70 text-base leading-relaxed mb-6">
              OnkoKlub vznikol z presvedčenia, že onkologickí pacienti a ich blízki
              potrebujú viac než len medicínsku starostlivosť. Potrebujú komunitu ľudí,
              ktorí to zažívajú tak isto. Potrebujú odborníkov, ktorým môžu dôverovať.
              A potrebujú praktické nástroje pre každodenný život — od cvičenia cez
              zvládanie stresu až po orientáciu v sociálnom systéme.
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="text-[#6F2380]/70 text-base leading-relaxed"
            >
              OnkoKlub je uzavretá platforma, ktorú vytvorilo občianske združenie{" "}
              <span className="font-bold text-[#6F2380]">NIE RAKOVINE, o. z.</span> —
              organizácia, ktorá sa od svojho vzniku venuje podpore onkologických pacientov
              na Slovensku. Všetko, čo v OnkoKlube nájdeš, je overené, bezpečné a vytvorené
              s ohľadom na teba.
            </motion.p>
          </motion.div>

          {/* Karty — na mobile nad textom, na desktop vpravo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease }}
            className="order-first md:order-last"
          >
            <div className="relative mt-14 mb-10 md:mt-0 md:mb-0" style={{ height: "420px" }}>
              <motion.div
                animate={{ y: [0,-8,0], rotate: [-8,-7,-8] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-[84%] rounded-[1.6rem] overflow-hidden"
                style={{ aspectRatio: "4/3", transformOrigin: "top left" }}
              >
                <Image
                  src="/images/niesivtomsam-2.jpg"
                  alt="Skupinová diskusia OnkoKlub"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                animate={{ y: [0,8,0], rotate: [6,7,6] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 right-[8%] md:right-[-12%] w-[84%] rounded-[1.6rem] overflow-hidden"
                style={{ aspectRatio: "4/3", transformOrigin: "bottom right" }}
              >
                <Image
                  src="/images/niesivtomsam-1.jpg"
                  alt="Joga OnkoKlub"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
