"use client";

import { useActionState } from "react";
import type { CancerType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { saveDiagnosisAction, type ActionState } from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { CancerTypeSelect } from "@/components/CancerTypeSelect";

const PHASES = ["1. fáza", "2. fáza", "3. fáza", "4. fáza", "Remisia"];

const INITIAL: ActionState = { ok: false };

export function DiagnosisForm({
  defaultDiagnosis,
  defaultPhase,
  defaultYear,
  defaultCancerTypes,
}: {
  defaultDiagnosis: string;
  defaultPhase: string;
  defaultYear: number | null;
  defaultCancerTypes: CancerType[];
}) {
  const [state, formAction] = useActionState(saveDiagnosisAction, INITIAL);

  return (
    <form action={formAction} className="mt-5 flex flex-col gap-3 px-5 pb-6">
      <div>
        <label className="mb-1 block text-base font-medium text-brand-purple/80">
          Typ onkologického ochorenia
        </label>
        <div className="[&_button]:text-sm [&_p]:text-sm">
          <CancerTypeSelect
            defaultValue={defaultCancerTypes}
            helpText="Vyberte jeden alebo viac typov. Podľa toho vám prispôsobíme obsah, profily, fóra a aktivity."
          />
        </div>
      </div>

      <input
        name="diagnosis"
        type="text"
        defaultValue={defaultDiagnosis}
        placeholder="Spresnenie diagnózy (voliteľné)"
        className="input-light mt-2 text-base"
      />

      <div>
        <label className="mb-1 block text-base font-medium text-brand-purple/80" htmlFor="phase">
          Fáza liečby
        </label>
        <select
          id="phase"
          name="phase"
          defaultValue={defaultPhase}
          className="input-light text-base text-brand-purple"
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
        <label className="mb-1 block text-base font-medium text-brand-purple/80" htmlFor="year">
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
          className="input-light text-base"
        />
      </div>

      <FormError message={state.message} />

      <div className="flex justify-center pt-2">
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
