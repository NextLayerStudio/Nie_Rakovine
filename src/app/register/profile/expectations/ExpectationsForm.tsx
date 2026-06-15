"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  saveExpectationsAction,
  type ActionState,
} from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { CheckboxList } from "@/components/CheckboxList";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";

const INITIAL: ActionState = { ok: false };

export function ExpectationsForm({
  expectationsOptions,
  helpOptions,
  defaultExpectations,
  defaultHelp,
  defaultConsentMembership,
  defaultConsentNewsletter,
}: {
  expectationsOptions: string[];
  helpOptions: string[];
  defaultExpectations: string[];
  defaultHelp: string[];
  defaultConsentMembership: boolean;
  defaultConsentNewsletter: boolean;
}) {
  const [state, formAction] = useActionState(saveExpectationsAction, INITIAL);

  return (
    <form
      action={formAction}
      className="mt-4 flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-2"
    >
      <h2 className="text-center text-base font-semibold text-brand-purple">
        Čo očakávate od členstva v ONKO KLUBE?
      </h2>
      <CheckboxList
        name="expectations"
        options={expectationsOptions}
        defaultSelected={defaultExpectations}
      />

      <h3 className="text-center text-sm font-semibold text-brand-purple">
        Čo by vám v tejto chvíli najviac pomohlo?
      </h3>
      <CheckboxList
        name="help"
        options={helpOptions}
        defaultSelected={defaultHelp}
      />

      <div className="space-y-1 border-t border-brand-purple/10 pt-4">
        <ConsentCheckbox
          name="consentMembership"
          required
          defaultChecked={defaultConsentMembership}
        >
          súhlas so spracovaním osobných údajov – členstvo
        </ConsentCheckbox>
        <ConsentCheckbox
          name="consentNewsletter"
          defaultChecked={defaultConsentNewsletter}
        >
          súhlas s posielaním newsletterov
        </ConsentCheckbox>
        <p className="pt-1 text-[11px] text-brand-purple/55">
          Viac o cookies:{" "}
          <Link
            href="/cookies"
            className="underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            Zásady cookies
          </Link>
        </p>
      </div>

      <FormError message={state.message} />

      <div className="flex justify-center pt-2">
        <SubmitButton
          className="btn-secondary w-40 justify-between"
          pendingLabel="Ukladám…"
        >
          <>
            Ďalej
            <Chevron />
          </>
        </SubmitButton>
      </div>
    </form>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
