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
    <form action={formAction} className="mx-5 space-y-4 pb-24">
      <p className="rounded-2xl bg-brand-pink-soft/40 p-3 text-center text-[11px] leading-relaxed text-brand-purple/80">
        Vytvorte vlastné fórum. Po odoslaní ho skontroluje administrátor —
        fórum sa zobrazí ostatným až po schválení.
      </p>

      <ForumImagePicker />

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Názov fóra
        </span>
        <input
          name="title"
          required
          placeholder="Napr. Mindfulness joga"
          className="w-full rounded-2xl border border-brand-purple/15 bg-white px-4 py-3 text-sm text-brand-purple outline-none focus:border-brand-purple"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          O čom je fórum?
        </span>
        <textarea
          name="description"
          rows={4}
          placeholder="Krátko opíšte, čomu sa fórum venuje a o čom sa v ňom diskutuje…"
          className="w-full rounded-2xl border border-brand-purple/15 bg-white px-4 py-3 text-sm text-brand-purple outline-none focus:border-brand-purple"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Farba fóra
        </span>
        <p className="mb-2 text-[11px] text-brand-purple/55">
          Použije sa, ak nepridáte fotku.
        </p>
        <input
          type="color"
          name="accentColor"
          defaultValue="#6F2380"
          className="h-11 w-16 cursor-pointer rounded-xl border border-brand-purple/15 bg-white p-1"
        />
      </label>

      <SubmitButton
        className="w-full rounded-full bg-brand-pink py-3 text-sm font-semibold text-white"
        pendingLabel="Odosielam…"
      >
        Odoslať na schválenie
      </SubmitButton>
      <FormError message={state.message} />
    </form>
  );
}
