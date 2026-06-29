"use client";

import { useActionState } from "react";
import { saveSourceAction, type ActionState } from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { CheckboxList } from "@/components/CheckboxList";
import { useFormRedirect } from "@/hooks/useFormRedirect";

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
  useFormRedirect(state);

  return (
    <form action={formAction} className="mt-8 flex flex-col items-center gap-5 px-5 pb-6">
      <h2 className="text-center text-xl font-bold leading-snug text-brand-purple">
        Čo od ONKO KLUBU očakávate?
      </h2>
      <CheckboxList
        name="gain"
        options={gainOptions}
        defaultSelected={defaultGain}
        variant="plain"
      />

      <h3 className="text-center text-xl font-bold leading-snug text-brand-purple">
        Odkiaľ ste sa o nás dozvedeli?
      </h3>
      <CheckboxList
        name="hearAboutUs"
        options={hearOptions}
        defaultSelected={defaultHear}
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
            <span>Hotovo</span>
            <span aria-hidden />
          </>
        </SubmitButton>
      </div>
    </form>
  );
}
