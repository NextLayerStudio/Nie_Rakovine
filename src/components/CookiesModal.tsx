"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CookiesContent } from "@/components/CookiesContent";

export function CookiesModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[min(85dvh,640px)] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookies-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-brand-purple/10 px-5 py-4">
          <h2
            id="cookies-modal-title"
            className="text-base font-bold text-brand-purple"
          >
            Zásady cookies
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

        <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-5">
          <CookiesContent className="card space-y-4 p-5 text-sm leading-relaxed text-brand-purple/85" />
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
