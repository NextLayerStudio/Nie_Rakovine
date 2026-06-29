"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function CheckboxList({
  name,
  options,
  defaultSelected = [],
  selected: selectedProp,
  onSelectedChange,
  variant = "filled",
  className,
}: {
  name: string;
  options: string[];
  defaultSelected?: string[];
  selected?: string[];
  onSelectedChange?: (selected: string[]) => void;
  variant?: "filled" | "plain";
  className?: string;
}) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const isControlled = selectedProp !== undefined;
  const selected = isControlled ? selectedProp : internalSelected;

  function toggle(value: string) {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    if (isControlled) onSelectedChange?.(next);
    else setInternalSelected(next);
  }

  return (
    <ul
      className={cn(
        "flex flex-col",
        variant === "plain"
          ? "mx-auto w-full max-w-[19rem] gap-3 self-center"
          : "gap-2",
        className,
      )}
    >
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <li key={option}>
            <label
              className={cn(
                "relative flex w-full cursor-pointer gap-3 leading-snug transition",
                variant === "plain"
                  ? "items-center py-1"
                  : "items-start rounded-2xl px-4 py-3 text-xs",
                variant !== "plain" &&
                  (checked
                    ? "bg-brand-pink text-white"
                    : "bg-brand-pink-soft/60 text-brand-purple"),
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
                  "grid flex-none place-items-center",
                  variant === "plain"
                    ? cn(
                        "h-6 w-6 shrink-0 rounded-md",
                        checked ? "bg-brand-pink text-white" : "bg-[#F2D9E2]",
                      )
                    : cn(
                        "mt-0.5 h-4 w-4 rounded-[5px] border-2",
                        checked
                          ? "border-white bg-white text-brand-pink"
                          : "border-brand-purple/50 bg-white",
                      ),
                )}
              >
                {checked && (
                  <svg
                    viewBox="0 0 16 16"
                    className={variant === "plain" ? "h-3.5 w-3.5" : "h-3 w-3"}
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
              <span
                className={cn(
                  variant === "plain"
                    ? "text-left text-lg text-[#1d1620]"
                    : "text-xs",
                )}
              >
                {option}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
