"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { loginAction, type ActionState } from "@/lib/actions/auth";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function LoginForm({
  next,
  isAdminLogin,
}: {
  next: string;
  isAdminLogin?: boolean;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, INITIAL);

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-6 flex flex-1 flex-col gap-4 px-6">
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
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={isAdminLogin ? "admin@onkoklub.sk" : "meno@email.sk"}
          defaultValue={isAdminLogin ? "admin@onkoklub.sk" : undefined}
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
          placeholder="••••••••"
          className="input-light"
          autoComplete="current-password"
        />
      </div>

      <FormError message={state.message} />

      <div className="mt-4 flex flex-col items-center gap-3">
        <SubmitButton
          className="btn-secondary w-56"
          pendingLabel="Prihlasujem…"
        >
          Prihlásiť sa
        </SubmitButton>
        <Link
          href="/reset-password"
          className="text-xs font-medium text-brand-purple/70 hover:text-brand-purple"
        >
          Zabudli ste heslo?
        </Link>
      </div>

      {!isAdminLogin ? (
        <p className="text-center text-[11px] text-brand-purple/60">
          Administrátor?{" "}
          <Link
            href="/login?next=/admin"
            className="font-semibold text-brand-purple"
          >
            Prihlásiť sa do adminu
          </Link>
        </p>
      ) : (
        <p className="text-center text-[11px] text-brand-purple/60">
          <Link href="/login" className="font-semibold text-brand-purple">
            Späť na bežné prihlásenie
          </Link>
        </p>
      )}

      <p className="mt-1 text-center text-[11px] text-brand-purple/60">
        Nemáte účet?{" "}
        <Link href="/register" className="font-semibold text-brand-purple">
          Registrujte sa
        </Link>
      </p>
    </form>
  );
}
