"use client";

import { useActionState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  registerGuestForEventAction,
  type ActionState,
} from "@/lib/actions/event-tickets";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function EventTicketModal({
  eventId,
  eventTitle,
  onClose,
}: {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    registerGuestForEventAction,
    INITIAL,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    // Refresh the server-rendered event list so the updated registration
    // count / capacity shows up without the visitor reloading the page.
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Zavrieť"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[#6F2380]/60 hover:bg-[#FDA4C7]/10"
          aria-label="Zavrieť"
        >
          ✕
        </button>

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
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
      </div>
    </div>,
    document.body,
  );
}
