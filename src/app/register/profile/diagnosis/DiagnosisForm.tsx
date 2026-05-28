"use client";

import { useActionState } from "react";
import { saveDiagnosisAction, type ActionState } from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";

const PHASES = ["1. fáza", "2. fáza", "3. fáza", "4. fáza", "Remisia"];

const INITIAL: ActionState = { ok: false };

export function DiagnosisForm({
  defaultDiagnosis,
  defaultPhase,
  defaultYear,
}: {
  defaultDiagnosis: string;
  defaultPhase: string;
  defaultYear: number | null;
}) {
  const [state, formAction] = useActionState(saveDiagnosisAction, INITIAL);

  return (
    <form action={formAction} className="mt-5 flex flex-1 flex-col gap-3 px-5">
      <input
        name="diagnosis"
        type="text"
        defaultValue={defaultDiagnosis}
        placeholder="napr. karcinóm prsníka"
        className="input-light"
      />

      <div>
        <label className="label" htmlFor="phase">
          Fáza liečby
        </label>
        <select
          id="phase"
          name="phase"
          defaultValue={defaultPhase}
          className="input-light text-brand-purple"
        >
          <option value="">Vyberte fázu</option>
          {PHASES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="year">
          Rok diagnostikovania
        </label>
        <input
          id="year"
          name="year"
          type="number"
          min="1950"
          max={new Date().getFullYear()}
          defaultValue={defaultYear ?? ""}
          placeholder="napr. 2024"
          className="input-light"
        />
      </div>

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
