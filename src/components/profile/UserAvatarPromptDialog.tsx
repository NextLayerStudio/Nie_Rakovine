"use client";

import { useEffect, useState } from "react";
import { hasAvatar, shouldOpenAvatarPrompt } from "@/lib/user-avatar";

export function UserAvatarPromptDialog({
  open,
  onUpload,
  onLater,
}: {
  open: boolean;
  onUpload: () => void;
  onLater: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="avatar-prompt-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-card">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-pink-soft text-brand-purple">
          <CameraIcon />
        </div>
        <h2
          id="avatar-prompt-title"
          className="mt-4 text-center text-base font-bold text-brand-purple"
        >
          Nastavte si profilovú fotku
        </h2>
        <p className="mt-2 text-center text-xs leading-relaxed text-brand-purple/65">
          Profilová fotografia sa zobrazí na vašej zľavovej karte a v profile.
          Odporúčame ju pridať hneď po registrácii.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onUpload}
            className="w-full rounded-pill bg-brand-pink py-3 text-sm font-bold text-white"
          >
            Nahrať fotografiu
          </button>
          <button
            type="button"
            onClick={onLater}
            className="w-full rounded-pill py-2.5 text-sm font-semibold text-brand-purple/70"
          >
            Neskôr
          </button>
        </div>
      </div>
    </div>
  );
}

/** Shows the setup alert until the user uploads a photo. */
export function UserAvatarPromptGate({
  avatarUrl,
  forcePrompt = false,
  onOpenUpload,
  dismissed,
  onDismiss,
}: {
  avatarUrl?: string | null;
  forcePrompt?: boolean;
  onOpenUpload: () => void;
  dismissed?: boolean;
  onDismiss?: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dismissed) {
      setOpen(false);
      return;
    }
    setOpen(
      shouldOpenAvatarPrompt({
        avatarUrl,
        forcePrompt,
      }),
    );
  }, [avatarUrl, forcePrompt, dismissed]);

  if (hasAvatar(avatarUrl)) return null;

  return (
    <UserAvatarPromptDialog
      open={open}
      onUpload={() => {
        setOpen(false);
        onOpenUpload();
      }}
      onLater={() => {
        setOpen(false);
        onDismiss?.();
      }}
    />
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M4 8h3l1.5-2h7L17 8h3a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
