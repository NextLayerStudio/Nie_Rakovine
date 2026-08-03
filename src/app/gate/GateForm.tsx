"use client";

import { useActionState } from "react";
import { unlockGateAction, type GateActionState } from "@/lib/actions/gate";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: GateActionState = { ok: false };

export function GateForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(unlockGateAction, INITIAL);

  return (
    <form action={formAction} className="w-full max-w-xs">
      <input type="hidden" name="next" value={next} />
      <input
        type="password"
        name="password"
        placeholder="Heslo"
        required
        autoFocus
        className="w-full rounded-full border-2 border-[#FDA4C7]/40 bg-white px-5 py-3.5 text-center text-base text-[#6F2380] outline-none focus:border-[#FDA4C7]"
      />
      <FormError message={state.message} />
      <SubmitButton
        className="mt-3 block w-full rounded-full bg-[#FDA4C7] py-3.5 text-base font-black text-white shadow-lg transition hover:brightness-105"
        pendingLabel="Overujem…"
      >
        Vstúpiť
      </SubmitButton>
    </form>
  );
}
