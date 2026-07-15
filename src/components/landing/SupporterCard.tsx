"use client";

import { useState } from "react";
import Link from "next/link";

const MIN_AMOUNT = 50;
const MAX_SLIDER = 500;
const STEP = 5;

function clamp(value: number): number {
  if (!Number.isFinite(value)) return MIN_AMOUNT;
  return Math.max(MIN_AMOUNT, Math.round(value));
}

export function SupporterCard({ className }: { className?: string }) {
  const [amount, setAmount] = useState(MIN_AMOUNT);
  const [editing, setEditing] = useState(false);

  return (
    <div
      className={
        className ??
        "flex flex-col rounded-[1.8rem] border border-[#E8B463]/30 bg-[#FFF7E8] px-6 py-7"
      }
    >
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#6F2380]/50">
        Podporujúce členstvo
      </p>
      <p className="mb-6 text-sm leading-relaxed text-[#6F2380]/55">
        Nie ste pacient, ale chcete podporiť komunitu? Jednorazová platba vám
        dá prístup na celý rok, rovnako ako pri ročnom členstve.
      </p>

      <div className="mb-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setAmount((a) => clamp(a - STEP))}
          aria-label="Znížiť sumu"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E8B463]/20 text-lg font-black text-[#B9812F] transition hover:bg-[#E8B463]/30"
        >
          −
        </button>

        {editing ? (
          <input
            type="number"
            autoFocus
            min={MIN_AMOUNT}
            step={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || MIN_AMOUNT)}
            onBlur={() => {
              setAmount((a) => clamp(a));
              setEditing(false);
            }}
            className="w-24 border-b-2 border-[#E8B463] bg-transparent text-center text-[2.2rem] font-black leading-none text-[#6F2380] outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-[2.2rem] font-black leading-none text-[#6F2380]"
            title="Kliknutím zadajte vlastnú sumu"
          >
            {amount} €
          </button>
        )}

        <button
          type="button"
          onClick={() => setAmount((a) => clamp(a + STEP))}
          aria-label="Zvýšiť sumu"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E8B463]/20 text-lg font-black text-[#B9812F] transition hover:bg-[#E8B463]/30"
        >
          +
        </button>
      </div>

      <input
        type="range"
        min={MIN_AMOUNT}
        max={MAX_SLIDER}
        step={STEP}
        value={Math.min(amount, MAX_SLIDER)}
        onChange={(e) => setAmount(clamp(Number(e.target.value)))}
        className="mb-2 w-full accent-[#E8B463]"
        aria-label="Suma podpory"
      />
      <p className="mb-6 text-center text-[11px] text-[#6F2380]/40">
        Minimálne {MIN_AMOUNT} € — sumu si zvoľte podľa vlastného uváženia
      </p>

      <Link
        href={`/welcome?plan=supporter&amount=${amount}`}
        className="mt-auto block w-full rounded-full bg-[#E8B463] py-3.5 text-center text-sm font-black text-white transition-transform active:scale-[0.98]"
      >
        Darovať {amount} €
      </Link>
    </div>
  );
}
