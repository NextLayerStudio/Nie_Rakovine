"use client";

import { useState } from "react";
import { seedContentAction, deleteSeedContentAction } from "@/lib/actions/seed-content";

export default function SeedContentPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (action: () => Promise<{ ok: boolean; message: string }>) => {
    setLoading(true);
    setMessage(null);
    const res = await action();
    setMessage(res.message);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 py-10">
      <h1 className="text-2xl font-bold text-brand-purple">Testovacie dáta</h1>
      <p className="text-sm text-brand-purple/70">
        Naplní databázu 11 príspevkami (4 fotky, 2 videá, 3 články, 2 recepty) s picsum.photos obrázkami.
        Bezpečné spustiť viackrát — preskočí existujúce.
      </p>

      <div className="flex flex-col gap-3">
        <button
          disabled={loading}
          onClick={() => run(seedContentAction)}
          className="rounded-md bg-brand-purple px-6 py-3 font-semibold text-white hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Prebieha..." : "▶ Naplniť testovacie príspevky"}
        </button>

        <button
          disabled={loading}
          onClick={() => {
            if (!confirm("Naozaj vymazať všetky testovacie príspevky?")) return;
            run(deleteSeedContentAction);
          }}
          className="rounded-md border border-red-300 px-6 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          🗑️ Vymazať testovacie príspevky
        </button>
      </div>

      {message && (
        <div className="rounded-md bg-brand-purple/8 p-4 text-sm font-medium text-brand-purple">
          {message}
        </div>
      )}
    </div>
  );
}
