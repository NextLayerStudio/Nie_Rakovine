"use client";

import { useActionState } from "react";
import {
  saveExpectationsAction,
  type ActionState,
} from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { CheckboxList } from "@/components/CheckboxList";

const INITIAL: ActionState = { ok: false };

export function ExpectationsForm({
  expectationsOptions,
  helpOptions,
  defaultExpectations,
  defaultHelp,
}: {
  expectationsOptions: string[];
  helpOptions: string[];
  defaultExpectations: string[];
  defaultHelp: string[];
}) {
  const [state, formAction] = useActionState(saveExpectationsAction, INITIAL);

  return (
    <form
      action={formAction}
      className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-2"
    >
      <h2 className="text-center text-base font-semibold text-brand-purple">
        Čo od ONKO KLUBU očakávate?
      </h2>
      <CheckboxList
        name="expectations"
        options={expectationsOptions}
        defaultSelected={defaultExpectations}
      />

      <h3 className="text-center text-sm font-semibold text-brand-purple">
        S čím by sme Vám vedeli pomôcť?
      </h3>
      <CheckboxList
        name="help"
        options={helpOptions}
        defaultSelected={defaultHelp}
      />

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
