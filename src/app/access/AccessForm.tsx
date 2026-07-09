"use client";

import { useActionState } from "react";
import {
  verifyStaffAccessAction,
  type StaffAccessState,
} from "@/lib/actions/staff-access";
import { FormError, SubmitButton } from "@/components/FormError";
import { useFormRedirect } from "@/hooks/useFormRedirect";

const INITIAL: StaffAccessState = { ok: false };

export function AccessForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(verifyStaffAccessAction, INITIAL);
  useFormRedirect(state);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <input
        type="password"
        name="password"
        required
        placeholder="Heslo"
        autoComplete="current-password"
        autoFocus
        className="input-light !py-4 !text-base text-center"
      />

      <FormError message={state.message} />

      <SubmitButton
        className="mt-1 rounded-full bg-[#FDA4C7] text-white text-sm font-black px-6 py-3.5"
        pendingLabel="Overujem…"
      >
        Pokračovať
      </SubmitButton>
    </form>
  );
}
