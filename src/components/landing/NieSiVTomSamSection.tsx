"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExpandableText } from "@/components/landing/ExpandableText";

const ease = [0.22, 1, 0.36, 1] as const;

function ProstriedkyBox({ fadeColor }: { fadeColor: string }) {
  return (
    <ExpandableText maxHeight={80} fadeColor={fadeColor}>
      <p className="text-[#6F2380]/70 text-sm leading-relaxed">
        Prostriedky získané prostredníctvom ONKO KLUBU smerujú späť do systému
        pomoci pre onkologických pacientov. Zabezpečujú fungovanie pacientskych
        poradní NIE RAKOVINE, bezplatné poradenstvo a rozvoj praktickej podpory
        pre ľudí s onkologickým ochorením na Slovensku. Prispievajú tiež k
        vzdelávaniu pacientov a ich blízkych, šíreniu overených informácií a
        zlepšovaniu dostupnosti pomoci v náročných životných situáciách.
      </p>
    </ExpandableText>
  );
}

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
            <ExpandableText maxHeight={168} fadeColor="#FFF3F9">
              <p className="text-[#6F2380]/70 text-base leading-relaxed mb-4">
                Za vznikom ONKO KLUBU stojí pacientská organizácia{" "}
                <span className="font-bold text-[#6F2380]">NIE RAKOVINE, o. z.</span>,
                ktorá už viac ako 10 rokov prináša osvetu, prevenciu a podporu ľudí s
                onkologickým ochorením a ich blízkych.
              </p>
              <p className="text-[#6F2380]/70 text-base leading-relaxed">
                Štruktúra ONKO KLUBU bola navrhnutá na základe zahraničných skúseností a
                odborných poznatkov o význame pohybu, psychickej pohody a komunity počas
                liečby aj po nej. Využíva overené prístupy z fyzioterapie, psychológie a
                relaxačných techník, aplikované v bezpečnom, zrozumiteľnom a podporujúcom
                prostredí.
              </p>
            </ExpandableText>

            {/* Na desktope pokračuje Prostriedky box hneď tu, pod textom */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.28, ease }}
              className="mt-6 hidden rounded-2xl bg-[#FDA4C7]/10 p-5 md:block"
            >
              <ProstriedkyBox fadeColor="#FCE9F0" />
            </motion.div>
          </motion.div>

          {/* Karty — len na desktope, prekrývajúce sa vpravo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease }}
            className="order-first hidden md:order-last md:block"
          >
            <div className="relative" style={{ height: "420px" }}>
              <motion.div
                animate={{ y: [0,-8,0], rotate: [-8,-7,-8] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-[84%]"
                style={{ aspectRatio: "4/3", transformOrigin: "top left" }}
              >
                <Image
                  src="/images/niesivtomsam-1.png"
                  alt="Komunita OnkoKlub"
                  fill
                  className="object-contain"
                />
              </motion.div>
              <motion.div
                animate={{ y: [0,8,0], rotate: [10,11,10] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-14 right-[-12%] w-[84%]"
                style={{ aspectRatio: "4/3", transformOrigin: "bottom right" }}
              >
                <Image
                  src="/images/niesivtomsam-2.png"
                  alt="Komunita OnkoKlub"
                  fill
                  className="object-contain"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Na mobile: obrázok 1 -> Prostriedky box (Zobraziť viac) -> obrázok 2 */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease }}
            className="relative mt-10 mb-6 mx-auto w-[84%]"
            style={{ aspectRatio: "4/3" }}
          >
            <Image
              src="/images/niesivtomsam-1.png"
              alt="Komunita OnkoKlub"
              fill
              className="object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mb-6 rounded-2xl bg-[#FDA4C7]/10 p-5"
          >
            <ProstriedkyBox fadeColor="#FCE9F0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="relative mb-2 mx-auto w-[84%]"
            style={{ aspectRatio: "4/3" }}
          >
            <Image
              src="/images/niesivtomsam-2.png"
              alt="Komunita OnkoKlub"
              fill
              className="object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
