"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type ActionState } from "@/lib/actions/auth";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, INITIAL);

  return (
    <form action={formAction} className="mt-4 flex flex-1 flex-col gap-3 px-6 pb-6">
      <div>
        <label className="label" htmlFor="fullName">
          Celé meno
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          placeholder="Jana Nováková"
          className="input-light"
          autoComplete="name"
        />
      </div>

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
          placeholder="••••••••"
          className="input-light"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="label" htmlFor="confirmPassword">
          Potvrdenie hesla
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          placeholder="••••••••"
          className="input-light"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="label" htmlFor="birthDate">
          Dátum narodenia
        </label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          className="input-light"
        />
      </div>

      <FormError message={state.message} />

      <div className="mt-4 flex flex-col items-center gap-3">
        <SubmitButton
          className="btn-secondary w-56"
          pendingLabel="Vytváram účet…"
        >
          Registrovať sa
        </SubmitButton>
        <p className="text-center text-[11px] leading-relaxed text-brand-purple/60">
          Registráciou súhlasíte s našimi{" "}
          <Link href="#" className="font-semibold text-brand-purple">
            podmienkami
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
