"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ActionState } from "@/lib/actions/auth";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPasswordAction, INITIAL);

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

      <div>
        <label className="label" htmlFor="password">
          Heslo
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Nové heslo"
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
          placeholder="Potvrdiť heslo"
          className="input-light"
          autoComplete="new-password"
        />
      </div>

      <FormError message={state.message} />
      {state.ok && state.message ? (
        <p className="text-center text-xs font-medium text-brand-purple">
          {state.message}
        </p>
      ) : null}

      <div className="mt-6 flex justify-center">
        <SubmitButton className="btn-secondary w-56" pendingLabel="Ukladám…">
          Vytvoriť nové heslo
        </SubmitButton>
      </div>
    </form>
  );
}
