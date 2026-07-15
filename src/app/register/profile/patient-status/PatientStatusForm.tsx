"use client";

import { useActionState, useState } from "react";
import {
  savePatientStatusAction,
  type ActionState,
} from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { cn } from "@/lib/utils";
import { useFormRedirect } from "@/hooks/useFormRedirect";

const INITIAL: ActionState = { ok: false };

const OPTIONS = [
  { value: "yes", label: "Áno, mám diagnózu" },
  { value: "no", label: "Nie, nie som pacient" },
] as const;

export function PatientStatusForm({
  defaultIsPatient,
}: {
  defaultIsPatient: boolean | null;
}) {
  const [selected, setSelected] = useState<"yes" | "no" | null>(
    defaultIsPatient === true ? "yes" : defaultIsPatient === false ? "no" : null,
  );
  const [state, formAction] = useActionState(savePatientStatusAction, INITIAL);
  useFormRedirect(state);

  return (
    <form action={formAction} className="mt-5 flex flex-1 flex-col gap-3 px-5 pb-6">
      <input type="hidden" name="isPatient" value={selected ?? ""} />

      <ul className="flex flex-col divide-y divide-brand-purple/10 overflow-hidden rounded-2xl border border-brand-purple/10 bg-white">
        {OPTIONS.map((option) => {
          const active = selected === option.value;
          return (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-4">
                <input
                  type="radio"
                  name="isPatient-visual"
                  value={option.value}
                  checked={active}
                  onChange={() => setSelected(option.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition",
                    active ? "border-brand-pink" : "border-brand-purple/25",
                  )}
                >
                  {active && (
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-pink" />
                  )}
                </span>
                <span className="text-base font-semibold text-brand-purple">
                  {option.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <FormError message={state.message} />

      <div className="mt-auto flex flex-col items-center gap-3 pt-2">
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
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4 shrink-0", className)} fill="none" aria-hidden>
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
