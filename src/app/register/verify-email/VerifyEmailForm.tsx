"use client";

import { useActionState } from "react";
import {
  resendVerificationCodeAction,
  verifyEmailCodeAction,
  type ActionState,
} from "@/lib/actions/verification";
import { FormError, SubmitButton } from "@/components/FormError";
import { useFormRedirect } from "@/hooks/useFormRedirect";

const INITIAL: ActionState = { ok: false };

export function VerifyEmailForm() {
  const [state, formAction] = useActionState(verifyEmailCodeAction, INITIAL);
  const [resendState, resendAction] = useActionState(
    resendVerificationCodeAction,
    INITIAL,
  );
  useFormRedirect(state);
  useFormRedirect(resendState);

  return (
    <div className="mt-6 flex flex-1 flex-col gap-5 px-6 pb-6">
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="label" htmlFor="code">
            Overovací kód
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={6}
            required
            placeholder="______"
            className="input-light text-center text-2xl font-bold tracking-[0.5em]"
          />
        </div>

        <FormError message={state.ok ? undefined : state.message} />

        <SubmitButton
          className="rounded-pill bg-brand-pink w-full py-4 text-lg font-bold text-white shadow-soft transition hover:brightness-105 active:scale-[0.99]"
          pendingLabel="Overujem…"
        >
          Overiť a pokračovať
        </SubmitButton>
      </form>

      <form
        action={resendAction}
        className="flex flex-col items-center gap-2 border-t border-brand-purple/10 pt-4"
      >
        <p className="text-center text-xs text-brand-purple/55">
          Nedostali ste kód? Skontrolujte spam alebo si nechajte poslať nový.
        </p>
        {resendState.ok && resendState.message ? (
          <p className="text-center text-xs font-medium text-emerald-600">
            {resendState.message}
          </p>
        ) : (
          <FormError message={resendState.message} />
        )}
        <SubmitButton
          className="text-sm font-semibold text-brand-purple/75 underline underline-offset-2 hover:text-brand-purple"
          pendingLabel="Odosielam…"
        >
          Poslať kód znova
        </SubmitButton>
      </form>
    </div>
  );
}
