"use client";

import { useActionState } from "react";
import { saveSourceAction, type ActionState } from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { CheckboxList } from "@/components/CheckboxList";

const INITIAL: ActionState = { ok: false };

export function SourceForm({
  gainOptions,
  hearOptions,
  defaultGain,
  defaultHear,
}: {
  gainOptions: string[];
  hearOptions: string[];
  defaultGain: string[];
  defaultHear: string[];
}) {
  const [state, formAction] = useActionState(saveSourceAction, INITIAL);

  return (
    <form
      action={formAction}
      className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-2"
    >
      <h2 className="text-center text-base font-semibold text-brand-purple">
        Čo od ONKO KLUBU očakávate?
      </h2>
      <CheckboxList
        name="gain"
        options={gainOptions}
        defaultSelected={defaultGain}
      />

      <h3 className="text-center text-sm font-semibold text-brand-purple">
        Odkiaľ ste sa o nás dozvedeli?
      </h3>
      <CheckboxList
        name="hearAboutUs"
        options={hearOptions}
        defaultSelected={defaultHear}
      />

      <FormError message={state.message} />

      <div className="flex justify-center pt-2">
        <SubmitButton className="btn-secondary w-40" pendingLabel="Ukladám…">
          Hotovo
        </SubmitButton>
      </div>
    </form>
  );
}
