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
      className="mt-6 space-y-3 rounded-2xl border border-brand-purple/10 bg-brand-purple/5 p-4"
    >
      <input type="hidden" name="forumId" value={forumId} />
      <h3 className="text-sm font-bold">Nový príspevok (admin)</h3>
      <input
        name="title"
        placeholder="Nadpis (voliteľné)"
        className="w-full rounded-xl border border-brand-purple/20 px-3 py-2 text-sm"
      />
      <textarea
        name="body"
        required
        rows={4}
        placeholder="Text príspevku"
        className="w-full rounded-xl border border-brand-purple/20 px-3 py-2 text-sm"
      />
      <input
        name="coverUrl"
        placeholder="Cover URL (voliteľné)"
        className="w-full rounded-xl border border-brand-purple/20 px-3 py-2 text-sm"
      />
      <FormError message={state.message} />
      {state.ok && state.message && (
        <p className="text-xs text-green-700">{state.message}</p>
      )}
      <SubmitButton className="rounded-pill bg-brand-purple px-4 py-2 text-xs font-semibold text-white">
        Publikovať príspevok
      </SubmitButton>
    </form>
  );
}
