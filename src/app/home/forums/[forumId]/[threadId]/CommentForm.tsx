"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createCommentAction,
  type ActionState,
} from "@/lib/actions/forums";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function CommentForm({
  forumId,
  threadId,
}: {
  forumId: string;
  threadId: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(createCommentAction, INITIAL);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <div
      className="fixed bottom-[88px] left-0 right-0 z-10 px-5"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <form
        action={formAction}
        className="mx-auto flex max-w-[340px] flex-col gap-2 rounded-full bg-brand-pink p-2 pl-5 shadow-soft"
      >
        <input type="hidden" name="forumId" value={forumId} />
        <input type="hidden" name="threadId" value={threadId} />
        <div className="flex items-center gap-2">
          <input
            name="body"
            type="text"
            required
            placeholder="Napíšte správu…"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white placeholder-white/80 outline-none"
          />
          <SubmitButton
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20 text-white"
            pendingLabel="…"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M4 16l6-6 6 6M10 10V4h4v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SubmitButton>
        </div>
        {state.ok && state.message ? (
          <p className="px-2 text-center text-[11px] font-medium text-white/95">
            {state.message}
          </p>
        ) : (
          <FormError message={state.message} />
        )}
      </form>
    </div>
  );
}
