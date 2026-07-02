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
              Nie ste v tom sami
            </h2>
            <p className="text-[#6F2380]/70 text-base leading-relaxed mb-6">
              Za vznikom ONKO KLUBU stojí pacientská organizácia{" "}
              <span className="font-bold text-[#6F2380]">NIE RAKOVINE, o. z.</span>,
              ktorá už viac ako 10 rokov prináša osvetu, prevenciu a podporu ľudí s
              onkologickým ochorením a ich blízkych.
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="text-[#6F2380]/70 text-base leading-relaxed"
            >
              Štruktúra ONKO KLUBU bola navrhnutá na základe zahraničných skúseností a
              odborných poznatkov o význame pohybu, psychickej pohody a komunity počas
              liečby aj po nej. Využíva overené prístupy z fyzioterapie, psychológie a
              relaxačných techník, aplikované v bezpečnom, zrozumiteľnom a podporujúcom
              prostredí.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.28, ease }}
              className="mt-6 rounded-2xl bg-[#FDA4C7]/10 p-5"
            >
              <p className="text-[#6F2380]/70 text-sm leading-relaxed">
                Prostriedky získané prostredníctvom ONKO KLUBU smerujú späť do systému
                pomoci pre onkologických pacientov. Zabezpečujú fungovanie pacientskych
                poradní NIE RAKOVINE, bezplatné poradenstvo a rozvoj praktickej podpory
                pre ľudí s onkologickým ochorením na Slovensku. Prispievajú tiež k
                vzdelávaniu pacientov a ich blízkych, šíreniu overených informácií a
                zlepšovaniu dostupnosti pomoci v náročných životných situáciách.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35, ease }}
              className="mt-8"
            >
              <p className="text-[#6F2380]/40 text-[10px] font-bold uppercase tracking-widest mb-2">Zakladateľ a prevádzkovateľ</p>
              <Image
                src="/images/logo-nie-rakovine.png"
                alt="NIE RAKOVINE, o. z."
                width={160}
                height={84}
                className="h-10 w-auto opacity-70"
              />
            </motion.div>
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
                  src="/images/niesivtomsam-1.jpg"
                  alt="Komunita OnkoKlub"
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
                  src="/images/niesivtomsam-2.jpg"
                  alt="Komunita OnkoKlub"
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
