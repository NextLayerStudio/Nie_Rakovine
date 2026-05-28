"use client";

import { useActionState } from "react";
import { saveInterestsAction, type ActionState } from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { CheckboxList } from "@/components/CheckboxList";

const INITIAL: ActionState = { ok: false };

export function InterestsForm({
  options,
  defaultSelected,
}: {
  options: string[];
  defaultSelected: string[];
}) {
  const [state, formAction] = useActionState(saveInterestsAction, INITIAL);

  return (
    <form
      action={formAction}
      className="mt-5 flex flex-1 flex-col gap-4 px-5 pb-2"
    >
      <CheckboxList
        name="interests"
        options={options}
        defaultSelected={defaultSelected}
      />

      <FormError message={state.message} />

      <div className="mt-auto pb-2">
        <SubmitButton
          className="btn-secondary mx-auto flex w-40 justify-between"
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
