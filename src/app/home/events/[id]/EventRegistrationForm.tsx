"use client";

import { useActionState, useEffect } from "react";
import {
  registerForEventAction,
  type ActionState,
} from "@/lib/actions/events";
import { FormError, SubmitButton } from "@/components/FormError";
import { EventPaymentStep } from "@/components/events/EventPaymentStep";

const INITIAL: ActionState = { ok: false };

export function EventRegistrationForm({
  eventId,
  eventTitle,
  defaultName,
  defaultSurname,
  variant = "page",
  stayOnPage = false,
  isPaid = false,
  priceCents = null,
  currency = "EUR",
  pendingPayment = false,
  onSuccess,
}: {
  eventId: string;
  eventTitle?: string;
  defaultName: string;
  defaultSurname: string;
  variant?: "page" | "modal";
  stayOnPage?: boolean;
  isPaid?: boolean;
  priceCents?: number | null;
  currency?: string;
  pendingPayment?: boolean;
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

  if (pendingPayment) {
    return (
      <p
        className={
          compact
            ? "mx-auto mt-5 max-w-[280px] rounded-pill bg-amber-400/20 py-2.5 text-center text-sm font-semibold text-amber-50"
            : "mt-5 rounded-pill bg-amber-400/20 py-2.5 text-center text-xs font-semibold text-white"
        }
      >
        Platba čaká na dokončenie
      </p>
    );
  }

  if (isPaid && priceCents) {
    return (
      <EventPaymentStep
        eventId={eventId}
        eventTitle={eventTitle ?? "Podujatie"}
        priceCents={priceCents}
        currency={currency}
        defaultName={defaultName}
        defaultSurname={defaultSurname}
        variant={variant}
        onSuccess={onSuccess}
      />
    );
  }

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
