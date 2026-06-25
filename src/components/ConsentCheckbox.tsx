"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Compact consent checkbox — pink square with white checkmark when selected. */
export function ConsentCheckbox({
  name,
  children,
  required,
  defaultChecked = false,
}: {
  name: string;
  children: React.ReactNode;
  required?: boolean;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="relative flex cursor-pointer items-start gap-3 py-1.5">
      <input
        type="checkbox"
        name={name}
        value="on"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        onFocus={(e) => e.currentTarget.blur()}
        required={required}
        className="sr-only"
      />
      <span
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md transition",
          checked
            ? "bg-brand-pink text-white"
            : "border-2 border-brand-pink/45 bg-white",
        )}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
            <path
              d="M3 8.5L6.5 12 13 5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-sm leading-snug text-brand-purple">{children}</span>
    </label>
  );
}
