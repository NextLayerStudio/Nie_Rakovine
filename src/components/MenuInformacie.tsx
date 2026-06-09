"use client";

import { useState } from "react";

export function MenuInformacie() {
  const [open, setOpen] = useState(true);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-medium hover:bg-white/15"
      >
        <MenuIcon name="info" />
        <span>Informácie</span>
        <svg
          viewBox="0 0 24 24"
          className={`ml-auto h-4 w-4 shrink-0 text-white/80 transition ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-2 pl-[4.25rem] text-[11px] leading-relaxed text-white/90">
          <p>
            Podržaním na ikone alebo na tlačidle otvoríte okno INFORMÁCIE. Toto
            okno vám rýchlo vysvetlí čo tlačidlá robia a na čo ich používať.
          </p>
          <p className="mt-2">
            Okno tiež ponúka užitočné tipy a rady pre lepší zážitok z používania
            aplikácie ONKOKLUB
          </p>
        </div>
      )}
    </li>
  );
}

function MenuIcon({ name }: { name: string }) {
  const path: Record<string, React.ReactNode> = {
    info: <path d="M12 9v6 M12 5h.01 M12 21a9 9 0 100-18 9 9 0 000 18z" />,
  };
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {path[name]}
      </svg>
    </span>
  );
}
