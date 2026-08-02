"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/FormError";
import {
  startFreeTrialAction,
  type SettingsActionState,
} from "@/lib/actions/settings";

const INITIAL: SettingsActionState = { ok: false };

export function TrialButton() {
  const [state, formAction] = useActionState(startFreeTrialAction, INITIAL);

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton
        className="btn-primary w-full py-3 text-sm"
        pendingLabel="Aktivujem…"
      >
        Vyskúšať 14 dní zadarmo
      </SubmitButton>
      {state.message && (
        <p
          className={`text-xs leading-relaxed ${state.ok ? "text-emerald-600" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
