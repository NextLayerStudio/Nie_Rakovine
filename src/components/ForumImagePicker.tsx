"use client";

import { useRef, useState } from "react";
import { maxImageUploadBytes } from "@/lib/image-upload-limits";

export function ForumImagePicker({
  accentColor = "#6F2380",
}: {
  accentColor?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const maxMb = Math.round(maxImageUploadBytes() / (1024 * 1024));

  function handleFile(file: File | null) {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Vyberte obrázok (JPG, PNG…).");
      return;
    }
    if (file.size > maxImageUploadBytes()) {
      setError(`Obrázok je príliš veľký (max. ${maxMb} MB).`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  const previewStyle = preview
    ? {
        backgroundImage: `url(${preview})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : { backgroundColor: accentColor };

  return (
    <div className="block">
      <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
        Profilová fotka fóra
      </span>
      <p className="mb-3 text-[11px] text-brand-purple/55">
        Voliteľné. Zobrazí sa ako avatar fóra po schválení. Väčšie fotky (do{" "}
        {maxMb} MB) sa automaticky zmenšia.
      </p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-purple/15"
          style={previewStyle}
          aria-label="Vybrať fotku fóra"
        >
          {!preview && (
            <span className="absolute inset-0 grid place-items-center text-white/90">
              <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" aria-hidden>
                <path
                  d="M12 16a4 4 0 100-8 4 4 0 000 8z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M4 7h2l1.5-2h9L18 7h2a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-brand-pink px-4 py-2.5 text-xs font-semibold text-brand-pink"
          >
            {preview ? "Zmeniť fotku" : "Pridať fotku"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => {
                if (preview) URL.revokeObjectURL(preview);
                setPreview(null);
                setError(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="mt-2 block text-[11px] text-brand-purple/60 underline"
            >
              Odstrániť
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        name="image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {error && (
        <p className="mt-2 text-[11px] text-red-600">{error}</p>
      )}
    </div>
  );
}
