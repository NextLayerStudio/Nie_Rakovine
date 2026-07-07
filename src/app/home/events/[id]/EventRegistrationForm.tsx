"use client";

import { useActionState, useEffect } from "react";
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
  variant = "page",
  stayOnPage = false,
  onSuccess,
}: {
  eventId: string;
  defaultName: string;
  defaultSurname: string;
  variant?: "page" | "modal";
  stayOnPage?: boolean;
  onSuccess?: () => void;
}) {
  const [state, formAction] = useActionState(
    registerForEventAction,
    INITIAL,
  );

  useEffect(() => {
    if (state.ok && onSuccess) onSuccess();
  }, [state.ok, onSuccess]);

  const compact = variant === "modal";

  return (
    <form
      action={formAction}
      className={
        compact
          ? "mx-auto mt-5 flex max-w-[280px] flex-col gap-2"
          : "mt-5 flex flex-col gap-3"
      }
    >
      <input type="hidden" name="eventId" value={eventId} />
      {stayOnPage && <input type="hidden" name="stayOnPage" value="1" />}
      {!compact && (
        <>
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
        </>
      )}
      {compact && (
        <>
          <input type="hidden" name="name" value={defaultName} />
          <input type="hidden" name="surname" value={defaultSurname} />
        </>
      )}
      <FormError message={state.message} />
      <SubmitButton
        className={
          compact
            ? "rounded-pill bg-brand-purple py-2.5 text-sm font-semibold text-white"
            : "mt-1 rounded-pill bg-brand-purple py-2 text-sm font-semibold text-white"
        }
        pendingLabel="Prihlasujem…"
      >
        Zaregistrovať sa
      </SubmitButton>
    </form>
  );
}
