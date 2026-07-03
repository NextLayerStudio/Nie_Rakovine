"use client";

import { useState, useTransition } from "react";
import { Frown, Annoyed, Meh, Smile, Laugh, type LucideIcon } from "lucide-react";
import { MOOD_OPTIONS, type MoodScore } from "@/lib/mood-options";
import { submitMoodEntryAction } from "@/lib/actions/mood";

const MOOD_ICONS: Record<MoodScore, LucideIcon> = {
  1: Frown,
  2: Annoyed,
  3: Meh,
  4: Smile,
  5: Laugh,
};

const DISMISS_KEY = "onko_mood_prompt_dismissed_on";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function wasDismissedToday(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(DISMISS_KEY) === todayKey();
  } catch {
    return false;
  }
}

/** Daily, dismissible mood check-in — mirrors the avatar-prompt gate pattern. */
export function MoodMeterPrompt({ hasLoggedToday }: { hasLoggedToday: boolean }) {
  const [dismissed, setDismissed] = useState(wasDismissedToday);
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<MoodScore | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (hasLoggedToday || dismissed) return null;

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, todayKey());
    } catch {
      // sessionStorage unavailable — the prompt will simply show again this session
    }
    setDismissed(true);
  };

  const handleSubmit = () => {
    if (!selected) {
      setError("Vyberte, prosím, jednu z možností.");
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.set("score", String(selected));
    formData.set("note", note);
    startTransition(async () => {
      const res = await submitMoodEntryAction({ ok: false }, formData);
      if (res.ok) {
        setSubmitted(true);
        setTimeout(handleDismiss, 1400);
      } else {
        setError(res.message ?? "Niečo sa pokazilo, skúste to prosím znova.");
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mood-prompt-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-card">
        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-pink-soft text-brand-purple">
              {(() => {
                const Icon = selected ? MOOD_ICONS[selected] : Smile;
                return <Icon size={26} strokeWidth={1.8} />;
              })()}
            </div>
            <p className="text-sm font-bold text-brand-purple">Ďakujeme za odpoveď.</p>
            <p className="text-xs text-brand-purple/60">
              Nálada bola uložená do vášho profilu.
            </p>
          </div>
        ) : (
          <>
            <h2
              id="mood-prompt-title"
              className="text-center text-base font-bold text-brand-purple"
            >
              Ako sa dnes cítite?
            </h2>
            <p className="mt-1.5 text-center text-xs leading-relaxed text-brand-purple/65">
              Táto informácia je súkromná a pomôže nám odporúčať vám vhodný obsah.
            </p>

            <div className="mt-5 flex justify-between gap-1.5">
              {MOOD_OPTIONS.map((opt) => {
                const Icon = MOOD_ICONS[opt.score];
                const active = selected === opt.score;
                return (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() => setSelected(opt.score)}
                    aria-pressed={active}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-2.5 transition-colors ${
                      active
                        ? "bg-brand-pink-soft text-brand-purple"
                        : "bg-brand-purple/5 text-brand-purple/50 hover:bg-brand-purple/10"
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                    <span className="text-center text-[10px] font-semibold leading-tight text-brand-purple/70">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Chcete niečo dodať? (nepovinné)"
              rows={2}
              maxLength={500}
              className="mt-4 w-full resize-none rounded-2xl border border-brand-purple/10 bg-brand-purple/[0.03] p-3 text-xs text-brand-purple outline-none placeholder:text-brand-purple/35 focus:border-brand-pink/40"
            />

            {error && (
              <p className="mt-2 text-center text-xs text-red-500">{error}</p>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={pending}
                className="w-full rounded-pill bg-brand-pink py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {pending ? "Ukladám…" : "Potvrdiť"}
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full rounded-pill py-2.5 text-sm font-semibold text-brand-purple/70"
              >
                Teraz nie
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
