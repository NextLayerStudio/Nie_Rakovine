"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "onko_cookie_consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      // localStorage nedostupné (napr. súkromné okno) - banner jednoducho nezobrazíme
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // ignorovať - banner sa aj tak zavrie na tejto návšteve
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Súhlas s používaním cookies"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-[0_10px_40px_-8px_rgba(111,35,128,0.35)] ring-1 ring-[#FDA4C7]/20 sm:flex-row sm:justify-between">
        <p className="text-center text-sm leading-relaxed text-[#6F2380]/80 sm:text-left">
          Používame cookies na zabezpečenie prihlásenia a fungovania stránky.
          Kliknutím na „Súhlasím“ súhlasíte s ich spracovaním v súlade s{" "}
          <Link href="/cookies" className="font-semibold underline underline-offset-2">
            Zásadami používania súborov cookies
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full bg-[#FDA4C7] px-6 py-2.5 text-sm font-black text-white transition hover:brightness-105"
        >
          Súhlasím
        </button>
      </div>
    </div>
  );
}
