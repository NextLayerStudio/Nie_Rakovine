"use client";

import { useState } from "react";
import { useActionState } from "react";
import { registerAction, type ActionState } from "@/lib/actions/auth";
import { FormError, SubmitButton } from "@/components/FormError";
import { TermsModal } from "@/components/TermsModal";
import { cn } from "@/lib/utils";
import { useFormRedirect } from "@/hooks/useFormRedirect";

const INITIAL: ActionState = { ok: false };

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, INITIAL);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  useFormRedirect(state);

  return (
    <>
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
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="flex w-full cursor-pointer items-start gap-3 py-1.5 text-left"
          >
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
              <span className="font-semibold underline underline-offset-2">
                obchodnými podmienkami a podmienkami používania
              </span>
            </span>
          </button>
          {/* hidden required checkbox drives native form validation */}
          <input
            type="checkbox"
            name="terms"
            value="on"
            checked={termsAccepted}
            onChange={() => {}}
            required
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
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

      {showTerms && (
        <TermsModal
          onAccept={() => {
            setTermsAccepted(true);
            setShowTerms(false);
          }}
          onClose={() => setShowTerms(false)}
        />
      )}
    </>
  );
}
