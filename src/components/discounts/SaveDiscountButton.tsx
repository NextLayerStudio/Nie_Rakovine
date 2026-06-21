"use client";

import { useState, useTransition } from "react";
import { toggleSavedDiscountOfferAction } from "@/lib/actions/discount-saves";

export function SaveDiscountButton({
  offerId,
  saved: initialSaved,
}: {
  offerId: string;
  saved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [, startTransition] = useTransition();

  const toggle = () => {
    setSaved((s) => !s);
    const fd = new FormData();
    fd.set("offerId", offerId);
    startTransition(() => {
      void toggleSavedDiscountOfferAction(fd);
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Odložené" : "Uložiť zľavu"}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/80 shadow-sm transition ${
        saved ? "text-brand-purple" : "text-brand-purple/50"
      }`}
    >
      <BookmarkIcon filled={saved} />
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
