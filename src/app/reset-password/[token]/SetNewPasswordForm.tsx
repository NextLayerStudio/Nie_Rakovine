"use client";

import { useActionState } from "react";
import { setNewPasswordAction, type ActionState } from "@/lib/actions/auth";
import { FormError, SubmitButton } from "@/components/FormError";
import { useFormRedirect } from "@/hooks/useFormRedirect";

const INITIAL: ActionState = { ok: false };

export function SetNewPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(setNewPasswordAction, INITIAL);
  useFormRedirect(state);

  return (
    <form action={formAction} className="mt-6 flex flex-1 flex-col gap-4 px-6">
      <input type="hidden" name="token" value={token} />

      <div>
        <label className="label" htmlFor="password">
          Nové heslo
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Min. 6 znakov"
          className="input-light"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="label" htmlFor="confirmPassword">
          Potvrdiť heslo
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          placeholder="Zopakujte nové heslo"
          className="input-light"
          autoComplete="new-password"
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
        <SubmitButton className="btn-secondary w-56" pendingLabel="Ukladám…">
          Nastaviť nové heslo
        </SubmitButton>
      </div>
    </form>
  );
}
