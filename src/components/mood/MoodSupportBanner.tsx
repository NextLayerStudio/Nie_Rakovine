"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMoodBannerStatusAction } from "@/lib/actions/mood";

const DISMISS_KEY = "onko_mood_banner_dismissed_on";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Contract spec: "ak ti je dlhodobo zle, odporučíme ti odborníka" — shown when the
 * last-3-day mood average drops to 2 or below. Content isn't topic-tagged yet, so
 * this recommends direct support channels rather than reordering the feed itself.
 */
export function MoodSupportBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === todayKey()) {
        setDismissed(true);
        return;
      }
    } catch {
      // ignore — sessionStorage unavailable
    }
    getMoodBannerStatusAction().then((res) => {
      if (res.ok && res.show) setShow(true);
    });
  }, []);

  if (!show || dismissed) return null;

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, todayKey());
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  return (
    <div className="mx-4 mt-4 rounded-3xl border border-brand-purple/10 bg-brand-purple/5 p-5">
      <p className="text-sm font-bold text-brand-purple">
        Všimli sme si, že sa posledné dni necítite najlepšie.
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-brand-purple/65">
        Nie ste v tom sami. Ozvite sa nám, alebo si prečítajte skúsenosti
        ostatných členov v diskusných fórach.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href="mailto:office@nierakovine.sk"
          className="flex-1 rounded-pill bg-brand-pink py-2.5 text-center text-xs font-bold text-white"
        >
          Kontaktovať podporu
        </a>
        <Link
          href="/home/forums"
          className="flex-1 rounded-pill border border-brand-purple/20 py-2.5 text-center text-xs font-bold text-brand-purple"
        >
          Otvoriť diskusné fóra
        </Link>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="mt-2 w-full text-center text-[11px] text-brand-purple/40"
      >
        Skryť
      </button>
    </div>
  );
}
