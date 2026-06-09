"use client";

import { useActionState } from "react";
import { createThreadAction, type ActionState } from "@/lib/actions/forums";
import { PostImagePicker } from "@/components/PostImagePicker";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function NewThreadForm({ forumId }: { forumId: string }) {
  const [state, formAction] = useActionState(createThreadAction, INITIAL);

  return (
    <form action={formAction} className="mx-5 space-y-3 pb-24">
      <input type="hidden" name="forumId" value={forumId} />
      <input
        name="title"
        placeholder="Nadpis (voliteľné)"
        className="w-full rounded-2xl border border-brand-purple/15 bg-white px-4 py-3 text-sm text-brand-purple outline-none focus:border-brand-purple"
      />
      <textarea
        name="body"
        required
        rows={6}
        placeholder="Napíšte príspevok do fóra…"
        className="w-full rounded-2xl border border-brand-purple/15 bg-white px-4 py-3 text-sm text-brand-purple outline-none focus:border-brand-purple"
      />
      <PostImagePicker />
      <p className="text-center text-[11px] text-brand-purple/60">
        Po odoslaní príspevok čaká na overenie administrátorom.
      </p>
      <SubmitButton className="w-full rounded-full bg-brand-pink py-3 text-sm font-semibold text-white">
        Odoslať na schválenie
      </SubmitButton>
      <FormError message={state.message} />
    </form>
  );
}
