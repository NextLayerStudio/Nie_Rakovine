"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function CheckboxList({
  name,
  options,
  defaultSelected = [],
}: {
  name: string;
  options: string[];
  defaultSelected?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  function toggle(value: string) {
    setSelected((curr) =>
      curr.includes(value)
        ? curr.filter((v) => v !== value)
        : [...curr, value],
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <li key={option}>
            <label
              className={cn(
                "relative flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 text-xs leading-snug transition",
                checked
                  ? "bg-brand-pink text-white"
                  : "bg-brand-pink-soft/60 text-brand-purple",
              )}
            >
              <input
                type="checkbox"
                name={name}
                value={option}
                checked={checked}
                onChange={() => toggle(option)}
                onFocus={(e) => e.currentTarget.blur()}
                className="sr-only"
              />
              <span
                className={cn(
                  "mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-[5px] border-2",
                  checked
                    ? "border-white bg-white text-brand-pink"
                    : "border-brand-purple/50 bg-white",
                )}
              >
                {checked && (
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                    fill="none"
                    aria-hidden
                  >
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
              <span>{option}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
