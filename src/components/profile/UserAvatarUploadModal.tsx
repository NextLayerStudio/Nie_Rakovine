"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { maxImageUploadBytes } from "@/lib/image-upload-limits";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { nameInitials } from "@/lib/membership-card";

export function UserAvatarUploadModal({
  open,
  onClose,
  fullName,
  avatarUrl,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  fullName: string;
  avatarUrl?: string | null;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(avatarUrl ?? null);
  const [hasNewFile, setHasNewFile] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const maxMb = Math.round(maxImageUploadBytes() / (1024 * 1024));
  const initials = nameInitials(fullName);

  useEffect(() => {
    if (open) {
      setPreview(avatarUrl ?? null);
      setHasNewFile(false);
      setLocalError(null);
      setPending(false);
      if (formRef.current) formRef.current.reset();
    }
  }, [open, avatarUrl]);

  if (!open) return null;

  function handleFile(file: File | null) {
    if (!file) return;
    setLocalError(null);

    if (!file.type.startsWith("image/")) {
      setLocalError("Vyberte obrázok (JPG, PNG…).");
      return;
    }
    if (file.size > maxImageUploadBytes()) {
      setLocalError(`Fotografia je príliš veľká (max. ${maxMb} MB).`);
      return;
    }

    setPreview(URL.createObjectURL(file));
    setHasNewFile(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasNewFile || pending) return;

    const formData = new FormData(event.currentTarget);
    const file = formData.get("avatar");
    if (!(file instanceof File) || file.size === 0) {
      setLocalError("Vyberte fotografiu.");
      return;
    }

    setPending(true);
    setLocalError(null);

    try {
      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      let payload: { ok?: boolean; message?: string; avatarUrl?: string } = {};
      try {
        payload = (await response.json()) as typeof payload;
      } catch {
        payload = {};
      }

      if (!response.ok || !payload.ok || !payload.avatarUrl) {
        setLocalError(
          payload.message ??
            (response.status === 401
              ? "Prihláste sa prosím znova."
              : "Nepodarilo sa nahrať fotografiu. Skúste znova."),
        );
        return;
      }

      onUploaded(payload.avatarUrl);
      onClose();
    } catch {
      setLocalError(
        "Nepodarilo sa spojiť so serverom. Skontrolujte pripojenie a skúste znova.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-upload-title"
      onClick={onClose}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-card"
      >
        <h2
          id="avatar-upload-title"
          className="text-base font-bold text-brand-purple"
        >
          Profilová fotografia
        </h2>
        <p className="mt-1 text-xs text-brand-purple/60">
          Zobrazí sa na vašej zľavovej karte a v profile.
        </p>

        <div className="mt-5 flex flex-col items-center">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-brand-pink/30"
            style={profileAvatarStyle(preview)}
            aria-label="Vybrať fotografiu"
          >
            {!preview && (
              <span className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-pink/80 to-brand-purple text-2xl font-bold text-white">
                {initials}
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-brand-purple/70 py-1 text-[10px] font-semibold text-white">
              Zmeniť
            </span>
          </button>

          <input
            ref={inputRef}
            type="file"
            name="avatar"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              handleFile(file);
            }}
          />

          <p className="mt-3 text-center text-[11px] text-brand-purple/50">
            JPG, PNG alebo WebP · max. {maxMb} MB
          </p>
        </div>

        {localError && (
          <p className="mt-3 text-center text-xs font-medium text-red-600">
            {localError}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="flex-1 rounded-pill border border-brand-purple/15 py-2.5 text-sm font-semibold text-brand-purple"
          >
            Zrušiť
          </button>
          <button
            type="submit"
            disabled={pending || !hasNewFile}
            className="flex-1 rounded-pill bg-brand-pink py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {pending ? "Nahrávam…" : "Uložiť"}
          </button>
        </div>
      </form>
    </div>
  );
}
