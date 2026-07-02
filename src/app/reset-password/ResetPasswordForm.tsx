"use client";

import { useActionState } from "react";
import { requestPasswordResetAction, type ActionState } from "@/lib/actions/auth";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordResetAction, INITIAL);

  return (
    <form action={formAction} className="mt-6 flex flex-1 flex-col gap-4 px-6">
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="meno@email.sk"
          className="input-light"
          autoComplete="email"
        />
      </div>

      {state.ok && state.message ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-center text-xs font-medium text-emerald-700">
          {state.message}
        </p>
      ) : (
        <FormError message={state.message} />
      )}

      <div className="mt-6 flex justify-center">
        <SubmitButton className="btn-secondary w-56" pendingLabel="Odosielam…">
          Poslať odkaz
        </SubmitButton>
      </div>
    </form>
  );
}
