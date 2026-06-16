"use client";

import { useActionState } from "react";
import { createThreadAction, type ActionState } from "@/lib/actions/forums";
import { PostImagePicker } from "@/components/PostImagePicker";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function NewThreadForm({ forumId }: { forumId: string }) {
  const [state, formAction] = useActionState(createThreadAction, INITIAL);

  return (
    <form action={formAction} className="mx-5 space-y-4 pb-24 pt-2">
      <input type="hidden" name="forumId" value={forumId} />

      <label className="block">
        <span className="forum-section-label mb-2 block normal-case tracking-normal text-brand-purple/70">
          Nadpis
        </span>
        <input
          name="title"
          placeholder="Voliteľný nadpis príspevku"
          className="forum-input"
        />
      </label>

      <label className="block">
        <span className="forum-section-label mb-2 block normal-case tracking-normal text-brand-purple/70">
          Príspevok
        </span>
        <textarea
          name="body"
          required
          rows={6}
          placeholder="Napíšte príspevok do fóra…"
          className="forum-input min-h-[160px] resize-y"
        />
      </label>

      <PostImagePicker />

      <p className="forum-banner-info text-center text-[11px]">
        Po odoslaní príspevok čaká na overenie administrátorom.
      </p>

      <SubmitButton className="forum-btn-primary">
        Odoslať na schválenie
      </SubmitButton>
      <FormError message={state.message} />
    </form>
  );
}
