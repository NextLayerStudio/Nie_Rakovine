"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function TermsModal({
  onAccept,
  onClose,
}: {
  onAccept: () => void;
  onClose: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom after mount so checkbox is immediately visible
  useEffect(() => {
    if (!mounted) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mounted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-[#FFF3F9]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-brand-purple/10 px-5 py-4">
        <h2
          id="terms-modal-title"
          className="text-base font-bold text-brand-purple"
        >
          Obchodné podmienky a podmienky používania
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-brand-purple/50 transition hover:text-brand-purple"
          aria-label="Zavrieť"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex-1 overflow-y-auto px-5 py-6 text-sm leading-relaxed text-brand-purple/80"
      >
        <h3 className="mb-3 text-sm font-bold text-brand-purple">
          1. Všeobecné ustanovenia
        </h3>
        <p className="mb-4">
          Tieto obchodné podmienky a podmienky používania (ďalej len „Podmienky“)
          upravujú práva a povinnosti registrovaných členov platformy OnkoKlub,
          ktorú prevádzkuje NIE RAKOVINE, o. z. so sídlom Cukrová 2272/14,
          811 01 Bratislava-Staré Mesto, IČO: 50654896 (ďalej len „Prevádzkovateľ“).
        </p>
        <p className="mb-4">
          Registráciou na platforme OnkoKlub potvrdzujete, že ste si tieto
          Podmienky prečítali, porozumeli im a súhlasíte s ich dodržiavaním.
          Ak s niektorou časťou Podmienok nesúhlasíte, nevyužívajte naše služby.
        </p>

        <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
          2. Členstvo a prístup k platforme
        </h3>
        <p className="mb-4">
          Členstvo na platforme OnkoKlub je určené pre onkologických pacientov,
          ich rodinných príslušníkov a osoby blízke tejto téme. Prevádzkovateľ
          si vyhradzuje právo odmietnuť registráciu alebo zrušiť členstvo
          v prípade porušenia týchto Podmienok.
        </p>
        <p className="mb-4">
          Členstvo je spoplatnené podľa aktuálneho cenníka zverejneného na
          platforme (mesačné alebo ročné predplatné). Platby sú spracovávané
          cez platobnú bránu GoPay. Prevádzkovateľ nezodpovedá za technické
          výpadky platobnej brány.
        </p>

        <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
          3. Pravidlá správania vo fóre a komunite
        </h3>
        <p className="mb-4">
          Všetci členovia sú povinní správať sa k ostatným s úctou a rešpektom.
          Zakazuje sa zverejňovanie urážlivého, diskriminačného alebo
          nenávistného obsahu. Príspevky s lekárskymi odporúčaniami musia byť
          jasne označené ako osobná skúsenosť, nie odborná rada.
        </p>
        <p className="mb-4">
          Prevádzkovateľ si vyhradzuje právo odstrániť akýkoľvek obsah, ktorý
          porušuje tieto pravidlá, a to bez predchádzajúceho upozornenia.
          Opakované porušovanie pravidiel môže viesť k trvalému zrušeniu
          členstva bez nároku na vrátenie platby.
        </p>

        <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
          4. Ochrana osobných údajov
        </h3>
        <p className="mb-4">
          Spracovanie osobných údajov sa riadi Zásadami ochrany osobných
          údajov, ktoré sú dostupné na platforme. Vaše zdravotné údaje
          (diagnóza) sú šifrované a prístupné výlučne vám. Prevádzkovateľ
          ich nesprístupňuje tretím stranám bez vášho výslovného súhlasu.
        </p>
        <p className="mb-4">
          Máte právo na prístup k svojim údajom, ich opravu, vymazanie
          a prenosnosť v zmysle nariadenia GDPR. Žiadosti o výkon práv
          zasielajte na adresu office@nierakovine.sk.
        </p>

        <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
          5. Zodpovednosť a obmedzenie záväzkov
        </h3>
        <p className="mb-4">
          Obsah dostupný na platforme OnkoKlub (videá, články, prednášky)
          má informatívny charakter a nenahrádza odbornú lekársku pomoc.
          Prevádzkovateľ nenesie zodpovednosť za zdravotné rozhodnutia
          prijaté na základe informácií zverejnených na platforme.
        </p>
        <p className="mb-4">
          Prevádzkovateľ nezodpovedá za dočasnú nedostupnosť platformy
          spôsobenú technickou údržbou alebo okolnosťami mimo jeho kontroly.
        </p>

        <h3 className="mb-3 mt-6 text-sm font-bold text-brand-purple">
          6. Zmeny podmienok
        </h3>
        <p className="mb-4">
          Prevádzkovateľ si vyhradzuje právo tieto Podmienky kedykoľvek
          zmeniť. O zmenách budete informovaní e-mailom najmenej 14 dní
          vopred. Pokračovanie v používaní platformy po nadobudnutí
          účinnosti zmien sa považuje za súhlas s novými Podmienkami.
        </p>
        <p className="mb-6">
          Tieto Podmienky nadobúdajú účinnosť dňom registrácie člena
          na platforme OnkoKlub.
        </p>

        {/* Divider + agreement checkbox */}
        <div className="border-t border-brand-purple/10 pt-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="sr-only"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span
              className={cn(
                "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md transition",
                agreed
                  ? "bg-brand-pink text-white"
                  : "border-2 border-brand-pink/45 bg-white",
              )}
            >
              {agreed && <CheckIcon />}
            </span>
            <span className="text-sm font-semibold leading-snug text-brand-purple">
              Áno, prečítal/a som si podmienky a súhlasím s nimi
            </span>
          </label>

          <button
            type="button"
            disabled={!agreed}
            onClick={onAccept}
            className="mt-5 w-full rounded-pill bg-brand-pink py-4 text-base font-bold text-white shadow-soft transition hover:brightness-105 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40"
          >
            Potvrdiť a pokračovať
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M3 8.5L6.5 12 13 5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
