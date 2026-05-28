"use client";

import { useActionState } from "react";
import {
  registerForEventAction,
  type ActionState,
} from "@/lib/actions/events";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function EventRegistrationForm({
  eventId,
  defaultName,
  defaultSurname,
}: {
  eventId: string;
  defaultName: string;
  defaultSurname: string;
}) {
  const [state, formAction] = useActionState(
    registerForEventAction,
    INITIAL,
  );

  return (
    <form action={formAction} className="mt-5 flex flex-col gap-3">
      <input type="hidden" name="eventId" value={eventId} />
      <input
        name="name"
        defaultValue={defaultName}
        placeholder="Meno"
        className="rounded-pill bg-white/15 px-4 py-2 text-sm text-white placeholder-white/70 outline-none focus:bg-white/25"
      />
      <input
        name="surname"
        defaultValue={defaultSurname}
        placeholder="Priezvisko"
        className="rounded-pill bg-white/15 px-4 py-2 text-sm text-white placeholder-white/70 outline-none focus:bg-white/25"
      />
      <FormError message={state.message} />
      <SubmitButton
        className="mt-1 rounded-pill bg-brand-purple py-2 text-sm font-semibold text-white"
        pendingLabel="Prihlasujem…"
      >
        Zaregistrovať sa
      </SubmitButton>
    </form>
  );
}
