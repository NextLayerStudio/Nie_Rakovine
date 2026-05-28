"use client";

import { useActionState } from "react";
import { createThreadAction, type ActionState } from "@/lib/actions/forums";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function NewThreadForm({ forumId }: { forumId: string }) {
  const [state, formAction] = useActionState(createThreadAction, INITIAL);

  return (
    <form action={formAction} className="flex flex-1 flex-col gap-4 px-5 py-4">
      <input type="hidden" name="forumId" value={forumId} />

      <div>
        <label className="label" htmlFor="title">
          Nadpis (voliteľné)
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="input-light"
          placeholder="Nadpis príspevku"
        />
      </div>

      <div>
        <label className="label" htmlFor="body">
          Text príspevku
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={8}
          className="w-full rounded-2xl border-0 bg-brand-pink-soft/50 px-4 py-3 text-sm text-brand-purple outline-none focus:bg-brand-pink-soft"
          placeholder="Napíšte, čo chcete zdieľať s komunitou…"
        />
      </div>

      <FormError message={state.message} />

      <SubmitButton className="btn-secondary w-full" pendingLabel="Ukladám…">
        Zverejniť príspevok
      </SubmitButton>
    </form>
  );
}
