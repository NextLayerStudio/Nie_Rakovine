"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  registerGuestForEventAction,
  type ActionState,
} from "@/lib/actions/event-tickets";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

/**
 * Guest registration form (meno, priezvisko, e-mail, telefón — no account
 * needed) for the standalone event detail page. Starts collapsed behind a
 * single CTA button; clicking it reveals the actual fields.
 */
export function EventGuestTicketForm({
  eventId,
  eventTitle,
  onSuccess,
}: {
  eventId: string;
  eventTitle: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [state, formAction] = useActionState(
    registerGuestForEventAction,
    INITIAL,
  );

  useEffect(() => {
    if (state.ok) {
      router.refresh();
      onSuccess?.();
    }
  }, [state.ok, router, onSuccess]);

  if (!started && !state.ok) {
    return (
      <button
        type="button"
        onClick={() => setStarted(true)}
        className="w-full rounded-full bg-[#FDA4C7] py-3 text-sm font-black text-white transition hover:brightness-105"
      >
        Prihlásiť sa na podujatie
      </button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {state.ok ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="flex flex-col items-center py-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1, duration: 0.4 }}
            className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <h3 className="mt-4 text-lg font-black text-[#6F2380]">
            Ste zaregistrovaní!
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#6F2380]/70">
            Skontrolujte si e-mail — lístok s QR kódom vám príde o chvíľu.
          </p>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <h3 className="pr-8 text-lg font-black leading-tight text-[#6F2380]">
            Registrácia — {eventTitle}
          </h3>
          <p className="mt-1 text-sm text-[#6F2380]/60">
            Vyplňte svoje údaje, lístok vám pošleme e-mailom.
          </p>

          <form action={formAction} className="mt-5 space-y-3">
            <input type="hidden" name="eventId" value={eventId} />
            <input
              name="firstName"
              placeholder="Meno"
              required
              className="w-full rounded-full border border-[#FDA4C7]/30 bg-white px-4 py-2.5 text-sm text-[#6F2380] placeholder-[#6F2380]/40 outline-none focus:border-[#FDA4C7]"
            />
            <input
              name="lastName"
              placeholder="Priezvisko"
              required
              className="w-full rounded-full border border-[#FDA4C7]/30 bg-white px-4 py-2.5 text-sm text-[#6F2380] placeholder-[#6F2380]/40 outline-none focus:border-[#FDA4C7]"
            />
            <input
              name="email"
              type="email"
              placeholder="E-mail (na lístok)"
              required
              className="w-full rounded-full border border-[#FDA4C7]/30 bg-white px-4 py-2.5 text-sm text-[#6F2380] placeholder-[#6F2380]/40 outline-none focus:border-[#FDA4C7]"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Telefónne číslo"
              required
              className="w-full rounded-full border border-[#FDA4C7]/30 bg-white px-4 py-2.5 text-sm text-[#6F2380] placeholder-[#6F2380]/40 outline-none focus:border-[#FDA4C7]"
            />

            <FormError message={state.message} />

            <SubmitButton
              className="mt-2 w-full rounded-full bg-[#FDA4C7] py-3 text-sm font-black text-white"
              pendingLabel="Odosielam…"
            >
              Potvrdiť
            </SubmitButton>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
