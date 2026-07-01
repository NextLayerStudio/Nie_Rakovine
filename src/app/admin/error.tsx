"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error boundary]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-lg border border-brand-purple/10 bg-white p-8 text-center shadow-card">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <h2 className="text-lg font-bold text-brand-purple">Niečo sa pokazilo</h2>
        <p className="mt-1 text-sm text-brand-purple/60">
          Akciu sa nepodarilo dokončiť. Skúste to prosím znova. Ak ste práve
          ukladali obsah, skontrolujte v zozname, či sa neuložil, aby ste
          nevytvorili duplicitu.
        </p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={reset} className="admin-btn-primary">
          Skúsiť znova
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="admin-btn-outline"
        >
          Obnoviť stránku
        </button>
      </div>
    </div>
  );
}
