"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { saveInterestsAction, type ActionState } from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { CheckboxList } from "@/components/CheckboxList";
import { useFormRedirect } from "@/hooks/useFormRedirect";

const INITIAL: ActionState = { ok: false };

export function InterestsForm({
  options,
  defaultSelected,
}: {
  options: string[];
  defaultSelected: string[];
}) {
  const [state, formAction] = useActionState(saveInterestsAction, INITIAL);
  useFormRedirect(state);

  return (
    <form action={formAction} className="mt-4 flex flex-col items-center gap-4 px-5 pb-6">
      <CheckboxList
        name="interests"
        options={options}
        defaultSelected={defaultSelected}
        variant="plain"
      />

      <FormError message={state.message} />

      <div className="flex w-full justify-center pt-6">
        <SubmitButton
          className="btn-secondary !grid w-[94%] grid-cols-[1fr_auto_1fr] items-center !px-4 !py-3.5 text-base font-medium"
          pendingLabel="Ukladám…"
        >
          <>
            <span aria-hidden />
            <span>Ďalej</span>
            <Chevron className="justify-self-end" />
          </>
        </SubmitButton>
      </div>
    </form>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 shrink-0", className)}
      fill="none"
      aria-hidden
    >
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
