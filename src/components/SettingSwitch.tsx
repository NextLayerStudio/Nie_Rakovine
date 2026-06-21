"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Toggle row for settings — submits "on" when enabled, nothing when disabled. */
export function SettingSwitch({
  name,
  label,
  description,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl px-1 py-2 transition hover:bg-brand-purple/[0.03]">
      <input
        type="checkbox"
        name={name}
        value="on"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="sr-only"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-brand-purple">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs leading-snug text-brand-purple/55">
            {description}
          </span>
        )}
      </span>
      <span
        className={cn(
          "relative mt-0.5 h-7 w-12 shrink-0 rounded-pill transition-colors",
          checked ? "bg-brand-pink" : "bg-brand-purple/15",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </span>
    </label>
  );
}
