"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const OTAZKY = [
  {
    q: "Kto sa môže stať členom ONKO KLUBU?",
    a: "ONKO KLUB je určený pre onkologických pacientov, ľudí po ukončenej liečbe a ich blízkych – partnerov, rodičov, deti aj priateľov. Pre prístup stačí jednoduchá registrácia.",
  },
  {
    q: "Je obsah v aplikácii ONKO KLUB overený?",
    a: "Áno. Obsah v aplikácii ONKO KLUB vytvára tím overených odborníkov – lekárov, psychológov, fyzioterapeutov a ďalších špecialistov. Pred zverejnením je vždy skontrolovaný a schválený.",
  },
  {
    q: "Je možné prispievať do diskusných fór anonymne?",
    a: "Áno. V rámci každého príspevku si môžete zvoliť, či chcete vystupovať pod svojím menom alebo anonymne. Vaša identita je viditeľná výhradne pre administrátora platformy, ostatným používateľom sa nezobrazuje.",
  },
  {
    q: "Ako prebieha platba za členstvo?",
    a: "Platba prebieha online cez platobnú bránu GoPay. V rámci mesačného členstva sa suma automaticky obnovuje každý mesiac, v prípade ročného členstva ide o jednorazovú platbu raz ročne. Platbu je možné kedykoľvek zrušiť v nastaveniach vášho účtu. Ak uprednostňujete úhradu formou trvalého príkazu, kontaktujte nás, prosím, na office@nierakovine.sk.",
  },
  {
    q: "Je možné členstvo kedykoľvek zrušiť?",
    a: "Áno. Členstvo môžete kedykoľvek zrušiť v nastaveniach svojho účtu bez sankcií a ďalších záväzkov. Prístup k platforme vám zostane aktívny do konca už zaplateného obdobia.",
  },
  {
    q: "Kde sa konajú podujatia a workshopy? Je potrebné cestovanie?",
    a: "Podujatia a workshopy sa konajú v Bratislave, Banskej Bystrici, Nitre, Košiciach, Poprade a ďalších mestách po celom Slovensku. Vybrané aktivity prebiehajú aj online a sú dostupné pre všetkých členov bez ohľadu na miesto bydliska. V kalendári si môžete jednoducho filtrovať podujatia podľa vášho regiónu.",
  },
  {
    q: "Sú moje osobné a zdravotné údaje v bezpečí?",
    a: "Áno. Citlivé údaje sú šifrované na úrovni aplikácie. Dáta sú ukladané na serveroch v rámci EÚ (región Frankfurt) a neopúšťajú územie Európskej únie. Spracúvanie osobných údajov prebieha v súlade s nariadením GDPR.",
  },
  {
    q: "Kto stojí za vznikom ONKO KLUBU?",
    a: "ONKO KLUB prevádzkuje občianske združenie NIE RAKOVINE, o. z., ktoré sa dlhodobo venuje podpore onkologických pacientov na Slovensku. IČO: 50654896, sídlo: Cukrová 2272/14, Bratislava.",
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
          Máte otázky?
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
