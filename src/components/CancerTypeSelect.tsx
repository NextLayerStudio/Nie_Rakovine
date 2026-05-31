"use client";

import { useState } from "react";
import type { CancerType } from "@prisma/client";
import { CANCER_TYPES, CANCER_TYPE_META } from "@/lib/cancer-type";

/**
 * Chip multi-select for cancer types. Submits each selected value as a
 * `cancerTypes` form field. Works inside any <form>.
 */
export function CancerTypeSelect({
  name = "cancerTypes",
  defaultValue = [],
  variant = "light",
  helpText,
}: {
  name?: string;
  defaultValue?: CancerType[];
  variant?: "light" | "admin";
  helpText?: string;
}) {
  const [selected, setSelected] = useState<Set<CancerType>>(
    new Set(defaultValue),
  );

  function toggle(t: CancerType) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  return (
    <div>
      {[...selected].map((t) => (
        <input key={t} type="hidden" name={name} value={t} />
      ))}

      <div className="flex flex-wrap gap-2">
        {CANCER_TYPES.map((t) => {
          const active = selected.has(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              aria-pressed={active}
              className={
                variant === "admin"
                  ? `rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-brand-purple bg-brand-purple text-white"
                        : "border-brand-purple/25 bg-white text-brand-purple hover:border-brand-purple/50"
                    }`
                  : `rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-brand-purple text-white"
                        : "bg-brand-pink-soft/40 text-brand-purple"
                    }`
              }
            >
              {CANCER_TYPE_META[t].short}
            </button>
          );
        })}
      </div>

      {helpText && (
        <p className="mt-2 text-[11px] text-brand-purple/55">{helpText}</p>
      )}
    </div>
  );
}
