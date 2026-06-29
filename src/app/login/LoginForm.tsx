"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions/auth";
import { FormError, SubmitButton } from "@/components/FormError";
import { LoginLoadingOverlay } from "./LoginLoadingOverlay";
import { useFormRedirect } from "@/hooks/useFormRedirect";

const INITIAL: ActionState = { ok: false };

export function LoginForm({
  next,
  isAdminLogin,
}: {
  next: string;
  isAdminLogin?: boolean;
}) {
  const [state, formAction] = useActionState(loginAction, INITIAL);
  const redirecting = useFormRedirect(state);

  return (
    <form action={formAction} className="mt-6 flex flex-1 flex-col gap-4 px-6">
      <LoginLoadingOverlay redirecting={redirecting} />
      <input type="hidden" name="next" value={next} />

      {isAdminLogin && (
        <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/5 px-4 py-3 text-center text-xs leading-relaxed text-brand-purple">
          <p className="font-semibold">Prihlásenie administrátora</p>
          <p className="mt-1 text-brand-purple/70">
            Použite admin e-mail z databázy (nie bežný členský účet).
          </p>
        </div>
      )}

      <div>
        <label className="label !text-base" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={isAdminLogin ? "admin@onkoklub.sk" : "meno@email.sk"}
          defaultValue={isAdminLogin ? "admin@onkoklub.sk" : undefined}
          className="input-light !py-4 !text-base"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="label !text-base" htmlFor="password">
          Heslo
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="input-light !py-4 !text-base"
          autoComplete="current-password"
        />
      </div>

      <FormError message={state.message} />

      <div className="mt-4 flex flex-col items-center gap-3">
        <SubmitButton
          className="rounded-pill bg-brand-pink w-full py-5 text-xl font-bold text-white shadow-soft transition hover:brightness-105 active:scale-[0.99]"
          pendingLabel="Prihlasujem…"
        >
          Prihlásiť sa
        </SubmitButton>
        <Link
          href="/reset-password"
          className="text-sm font-medium text-brand-purple/70 hover:text-brand-purple"
        >
          Zabudli ste heslo?
        </Link>
      </div>

      <p className="mt-1 text-center text-sm text-brand-purple/60">
        Nemáte účet?{" "}
        <Link href="/register" className="font-semibold text-brand-purple">
          Registrujte sa
        </Link>
      </p>
    </form>
  );
}
