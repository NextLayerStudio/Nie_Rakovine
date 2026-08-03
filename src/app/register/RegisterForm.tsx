"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { registerAction, type ActionState } from "@/lib/actions/auth";
import { FormError, SubmitButton } from "@/components/FormError";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFormRedirect } from "@/hooks/useFormRedirect";
import {
  PRESELECTED_AMOUNT_KEY,
  PRESELECTED_PLAN_KEY,
  normalizePlanParam,
} from "@/lib/preselected-plan";

const INITIAL: ActionState = { ok: false };

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, INITIAL);
  const [termsAccepted, setTermsAccepted] = useState(false);
  useFormRedirect(state);

  // Remember a plan (and Supporter amount) chosen on a public marketing
  // page so /register/subscription can pre-select it after signup.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = normalizePlanParam(params.get("plan"));
    if (!plan) return;
    sessionStorage.setItem(PRESELECTED_PLAN_KEY, plan);
    const amount = params.get("amount");
    if (plan === "SUPPORTER" && amount) {
      sessionStorage.setItem(PRESELECTED_AMOUNT_KEY, amount);
    }
  }, []);

  return (
    <>
      <form action={formAction} className="mt-4 flex flex-1 flex-col gap-3 px-6 pb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="label" htmlFor="firstName">
              Meno
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              placeholder="Jana"
              className="input-light"
              autoComplete="given-name"
            />
          </div>
          <div className="flex-1">
            <label className="label" htmlFor="lastName">
              Priezvisko
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder="Nováková"
              className="input-light"
              autoComplete="family-name"
            />
          </div>
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
          {/* Clip iOS date input — native control ignores border-radius/min-width otherwise */}
          <div className="w-full overflow-hidden rounded-pill">
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="input-light block w-full min-w-0 max-w-full"
            />
          </div>
        </div>

        {/* Terms consent */}
        <div className="pt-1">
          <label className="flex w-full cursor-pointer items-start gap-3 py-1.5 text-left">
            <input
              type="checkbox"
              name="terms"
              value="on"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
              className="sr-only"
            />
            <span
              className={cn(
                "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md transition",
                termsAccepted
                  ? "bg-brand-pink text-white"
                  : "border-2 border-brand-pink/45 bg-white",
              )}
            >
              {termsAccepted && (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path
                    d="M3 8.5L6.5 12 13 5"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="text-sm leading-snug text-brand-purple">
              Súhlasím s{" "}
              <Link
                href="/podmienky"
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="font-semibold underline underline-offset-2"
              >
                Podmienkami používania
              </Link>
            </span>
          </label>
        </div>

        <FormError message={state.message} />

        <div className="mt-2 flex flex-col items-center gap-3">
          <SubmitButton
            className="rounded-pill bg-brand-pink w-full py-5 text-xl font-bold text-white shadow-soft transition hover:brightness-105 active:scale-[0.99]"
            pendingLabel="Vytváram účet…"
          >
            Registrovať sa
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
