"use client";

import { useActionState, useEffect, useState } from "react";
import {
  initiateEventPaymentAction,
  type ActionState,
} from "@/lib/actions/events";
import { FormError, SubmitButton } from "@/components/FormError";
import { formatEventPrice } from "@/lib/event-payment";

const INITIAL: ActionState = { ok: false };

export function EventPaymentStep({
  eventId,
  eventTitle,
  priceCents,
  currency,
  defaultName,
  defaultSurname,
  variant = "page",
  onSuccess,
}: {
  eventId: string;
  eventTitle: string;
  priceCents: number;
  currency: string;
  defaultName: string;
  defaultSurname: string;
  variant?: "page" | "modal";
  onSuccess?: () => void;
}) {
  const [state, formAction] = useActionState(
    initiateEventPaymentAction,
    INITIAL,
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const compact = variant === "modal";
  const priceLabel = formatEventPrice(priceCents, currency);

  useEffect(() => {
    if (state.ok && onSuccess) onSuccess();
  }, [state.ok, onSuccess]);

  return (
    <div
      className={
        compact
          ? "mx-auto mt-5 max-w-[280px] space-y-3"
          : "mt-5 space-y-3"
      }
    >
      <div
        className={`rounded-2xl border border-white/20 bg-white/10 ${
          compact ? "px-3 py-3" : "px-4 py-4"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
            Platené podujatie
          </span>
          <span className="text-lg font-extrabold text-white">{priceLabel}</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-white/75">
          Registrácia bude dokončená až po úspešnej platbe.
        </p>
      </div>

      <div
        className={`rounded-2xl bg-white/10 ${
          compact ? "px-3 py-3" : "px-4 py-4"
        }`}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
          Súhrn objednávky
        </p>
        <div className="mt-2 flex items-start justify-between gap-3 text-sm text-white">
          <span className="leading-snug">{eventTitle}</span>
          <span className="shrink-0 font-semibold">{priceLabel}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3 text-sm font-bold text-white">
          <span>Celkom</span>
          <span>{priceLabel}</span>
        </div>
      </div>

      <div
        className={`rounded-2xl border border-dashed border-white/25 bg-white/5 ${
          compact ? "px-3 py-3" : "px-4 py-4"
        }`}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <CardIcon />
          Platba kartou
        </div>
        <p className="mt-2 text-xs leading-relaxed text-white/70">
          Platobná brána bude čoskoro pripojená. Tlačidlo nižšie pripraví
          platbu a registráciu po dokončení platby.
        </p>
      </div>

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="name" value={defaultName} />
        <input type="hidden" name="surname" value={defaultSurname} />

        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-snug text-white/85">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-purple"
          />
          Súhlasím s úhradou poplatku za podujatie a spracovaním platby.
        </label>

        <FormError message={state.message} />

        <SubmitButton
          disabled={!acceptedTerms}
          className={
            compact
              ? "w-full rounded-pill bg-brand-purple py-2.5 text-sm font-semibold text-white disabled:opacity-40"
              : "w-full rounded-pill bg-brand-purple py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          }
          pendingLabel="Pripravujem platbu…"
        >
          Zaplatiť {priceLabel}
        </SubmitButton>
      </form>
    </div>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" aria-hidden>
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M6 15h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
