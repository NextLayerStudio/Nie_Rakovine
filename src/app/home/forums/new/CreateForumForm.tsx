"use client";

import { useActionState } from "react";
import {
  createForumByUserAction,
  type ActionState,
} from "@/lib/actions/forums";
import { ForumImagePicker } from "@/components/ForumImagePicker";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function CreateForumForm() {
  const [state, formAction] = useActionState(createForumByUserAction, INITIAL);

  return (
    <form action={formAction} className="mx-5 space-y-4 pb-24 pt-2">
      <p className="forum-banner text-center text-[11px] leading-relaxed">
        Vytvorte vlastné fórum. Po odoslaní ho skontroluje administrátor —
        fórum sa zobrazí ostatným až po schválení.
      </p>

      <ForumImagePicker />

      <label className="block">
        <span className="forum-section-label mb-2 block normal-case tracking-normal text-brand-purple/70">
          Názov fóra
        </span>
        <input
          name="title"
          required
          placeholder="Napr. Mindfulness joga"
          className="forum-input"
        />
      </label>

      <label className="block">
        <span className="forum-section-label mb-2 block normal-case tracking-normal text-brand-purple/70">
          O čom je fórum?
        </span>
        <textarea
          name="description"
          rows={4}
          placeholder="Krátko opíšte, čomu sa fórum venuje a o čom sa v ňom diskutuje…"
          className="forum-input min-h-[120px] resize-y"
        />
      </label>

      <label className="block">
        <span className="forum-section-label mb-2 block normal-case tracking-normal text-brand-purple/70">
          Farba fóra
        </span>
        <p className="mb-2 text-[11px] text-brand-purple/50">
          Použije sa, ak nepridáte fotku.
        </p>
        <input
          type="color"
          name="accentColor"
          defaultValue="#6F2380"
          className="h-12 w-16 cursor-pointer rounded-2xl border border-brand-purple/12 bg-white p-1 shadow-sm"
        />
      </label>

      <SubmitButton className="forum-btn-primary" pendingLabel="Odosielam…">
        Odoslať na schválenie
      </SubmitButton>
      <FormError message={state.message} />
    </form>
  );
}
