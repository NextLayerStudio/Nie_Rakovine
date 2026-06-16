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
      className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-purple/10 bg-white/95 px-5 pt-3 backdrop-blur-md shadow-[0_-4px_24px_rgba(111,35,128,0.08)]"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <form action={formAction} className="mx-auto max-w-[460px]">
        <input type="hidden" name="forumId" value={forumId} />
        <input type="hidden" name="threadId" value={threadId} />

        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-brand-purple/60">
          Napíšte komentár
        </label>

        <div className="flex items-end gap-2 rounded-[28px] bg-brand-pink p-2 pl-4 shadow-soft">
          <textarea
            name="body"
            required
            rows={1}
            placeholder="Napíšte správu…"
            className="max-h-28 min-h-[40px] min-w-0 flex-1 resize-none bg-transparent py-2 text-sm leading-snug text-white placeholder-white/75 outline-none"
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
            }}
          />
          <SubmitButton
            aria-label="Odoslať"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand-pink transition hover:brightness-95"
            pendingLabel="…"
          >
            <SendIcon />
          </SubmitButton>
        </div>

        {state.ok && state.message ? (
          <p className="mt-2 text-center text-[11px] font-medium text-emerald-700">
            {state.message}
          </p>
        ) : (
          <FormError message={state.message} />
        )}
      </form>
    </div>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M5 12l14-7-4 14-2-5-5-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
