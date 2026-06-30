"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createForumThreadAction,
  type ActionState,
} from "@/lib/actions/admin-forums";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function ForumThreadForm({ forumId }: { forumId: string }) {
  const router = useRouter();
  const [state, formAction] = useActionState(createForumThreadAction, INITIAL);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form
      action={formAction}
      className="mt-6 space-y-3 rounded-lg border border-brand-purple/15 bg-brand-purple/[0.04] p-5"
    >
      <input type="hidden" name="forumId" value={forumId} />
      <h3 className="text-sm font-bold text-brand-purple">
        Nový príspevok (admin)
      </h3>
      <input
        name="title"
        placeholder="Nadpis (voliteľné)"
        className="admin-input"
      />
      <textarea
        name="body"
        required
        rows={4}
        placeholder="Text príspevku"
        className="admin-input"
      />
      <input
        name="coverUrl"
        placeholder="Cover URL (voliteľné)"
        className="admin-input"
      />
      <FormError message={state.message} />
      {state.ok && state.message && (
        <p className="text-xs font-medium text-emerald-700">{state.message}</p>
      )}
      <SubmitButton className="admin-btn-primary">
        Publikovať príspevok
      </SubmitButton>
    </form>
  );
}
