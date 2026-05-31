"use client";

import { useState } from "react";

/** Admin URL field with circular preview for profile / forum pictures. */
export function AdminImageField({
  name,
  label,
  hint,
  defaultValue = "",
  shape = "circle",
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  shape?: "circle" | "rounded";
}) {
  const [url, setUrl] = useState(defaultValue);

  const previewClass =
    shape === "circle"
      ? "h-20 w-20 rounded-full"
      : "h-20 w-32 rounded-xl";

  const previewStyle = url.trim()
    ? {
        backgroundImage: `url(${url.trim()})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : {
        background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)",
      };

  return (
    <div className="block">
      <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
        {label}
      </span>
      {hint && (
        <p className="mb-2 text-[11px] text-brand-purple/55">{hint}</p>
      )}
      <div className="flex items-start gap-4">
        <div
          aria-hidden
          className={`shrink-0 border border-brand-purple/10 ${previewClass}`}
          style={previewStyle}
        />
        <input
          name={name}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className="min-w-0 flex-1 rounded-xl border border-brand-purple/20 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
        />
      </div>
    </div>
  );
}
