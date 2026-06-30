"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const OTAZKY = [
  {
    q: "Kto môže byť členom OnkoKlubu?",
    a: "OnkoKlub je určený pre onkologických pacientov, ľudí po onkologickej liečbe a ich blízkych — partnerov, rodičov, deti, priateľov. Stačí sa zaregistrovať.",
  },
  {
    q: "Je obsah na platforme odborne overený?",
    a: "Áno. Všetok obsah na OnkoKlub platforme tvorí tím overených odborníkov — lekárov, psychológov, fyzioterapeutov a ďalších špecialistov. Nič sa nepublikuje bez schválenia.",
  },
  {
    q: "Môžem písať vo fóre anonymne?",
    a: "Áno. Pri každom príspevku vo fóre si môžeš vybrať, či chceš písať pod svojím menom alebo anonymne. Tvoje skutočné meno nikdy neuvidí nikto iný — len administrátor platformy.",
  },
  {
    q: "Ako funguje platba?",
    a: "Platíš kartou online cez platobnú bránu GoPay. Pre mesačné členstvo sa platba opakuje každý mesiac automaticky. Pre ročné členstvo platíš jednorazovo raz za rok. Platbu môžeš kedykoľvek zrušiť z nastavení svojho účtu. Ak preferuješ trvalý príkaz, kontaktuj nás na office@nierakovine.sk.",
  },
  {
    q: "Môžem členstvo kedykoľvek zrušiť?",
    a: "Áno. Členstvo môžeš zrušiť kedykoľvek z nastavení svojho účtu — bez pokuty, bez záväzkov. Prístup k platforme ti zostane aktívny do konca aktuálneho zaplateného obdobia.",
  },
  {
    q: "Kde sa konajú eventy? Musím cestovať?",
    a: "Eventy sa konajú v Bratislave, Nitre, Košiciach, Poprade a ďalších mestách. Mnohé akcie sú aj online — tie sú dostupné pre všetkých členov bez ohľadu na bydlisko. V kalendári si môžeš filtrovať eventy podľa svojho kraja.",
  },
  {
    q: "Sú moje zdravotné údaje v bezpečí?",
    a: "Áno. Citlivé údaje sú šifrované na úrovni aplikácie. Databáza beží v EÚ regióne (Frankfurt) a nikdy nevychádza z Európskej únie. Spracúvanie osobných údajov prebieha v súlade s GDPR.",
  },
  {
    q: "Kto stojí za OnkoKlubom?",
    a: "OnkoKlub vytvára a prevádzkuje občianske združenie NIE RAKOVINE, o. z. — organizácia, ktorá sa od svojho vzniku venuje podpore onkologických pacientov na Slovensku. IČO: 50654896, sídlo: Cukrová 2272/14, Bratislava.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="pb-20"><div className="max-w-6xl mx-auto px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
          FAQ
        </p>
        <h2 className="text-[2.2rem] font-black text-[#6F2380] leading-[1.1]">
          Máš otázky?
          <br />
          Máme odpovede.
        </h2>
      </motion.div>

      <div className="flex flex-col divide-y divide-[#FDA4C7]/15">
        {OTAZKY.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-start justify-between gap-4 py-5 text-left"
            >
              <span className="font-black text-[#6F2380] text-[15px] leading-snug">{item.q}</span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-200"
                style={{ backgroundColor: open === i ? "#6F2380" : "#FDA4C7" + "20" }}
              >
                {open === i
                  ? <Minus size={13} className="text-white" strokeWidth={2.5} />
                  : <Plus size={13} className="text-[#FDA4C7]" strokeWidth={2.5} />
                }
              </div>
            </button>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-[#6F2380]/60 text-[14px] leading-relaxed pb-5 pr-10">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
