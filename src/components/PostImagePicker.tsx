"use client";

import { useRef, useState } from "react";
import {
  IMAGE_FILE_INPUT_ACCEPT,
  isLikelyImageFile,
  maxImageUploadBytes,
} from "@/lib/image-upload-limits";

export function PostImagePicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const maxMb = Math.round(maxImageUploadBytes() / (1024 * 1024));

  function handleFile(file: File | null) {
    if (!file) return;
    setError(null);

    if (!isLikelyImageFile(file)) {
      setError("Vyberte obrázok (JPG, PNG…).");
      return;
    }
    if (file.size > maxImageUploadBytes()) {
      setError(`Obrázok je príliš veľký (max. ${maxMb} MB).`);
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  }

  function remove() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="block">
      <span className="mb-2 block text-xs font-semibold text-brand-purple/80">
        Obrázok (voliteľné)
      </span>

      {preview ? (
        <div className="relative overflow-hidden rounded-2xl">
          <div
            className="aspect-[16/10] w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${preview})` }}
          />
          <button
            type="button"
            onClick={remove}
            className="absolute right-2 top-2 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white"
          >
            Odstrániť
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-purple/25 bg-white py-8 text-sm font-semibold text-brand-purple/70"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
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
          Pridať fotku
        </button>
      )}

      <input
        ref={inputRef}
        name="image"
        type="file"
        accept={IMAGE_FILE_INPUT_ACCEPT}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <p className="mt-2 text-[11px] text-brand-purple/55">
        Môžete nahrať väčšiu fotku (do {maxMb} MB) — systém ju automaticky
        zmenší.
      </p>

      {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
