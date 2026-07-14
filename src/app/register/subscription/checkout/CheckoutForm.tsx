"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  confirmSubscriptionPaymentAction,
  type ActionState,
} from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useFormRedirect } from "@/hooks/useFormRedirect";

const INITIAL: ActionState = { ok: false };

const PAYMENT_LOGOS = [
  { src: "/images/platby/gopay.png", alt: "GoPay", w: 100, h: 35 },
  { src: "/images/platby/visa.png", alt: "VISA", w: 67, h: 23 },
  { src: "/images/platby/verified-by-visa.png", alt: "Verified by VISA", w: 67, h: 30 },
  { src: "/images/platby/mastercard.png", alt: "Mastercard", w: 67, h: 43 },
  { src: "/images/platby/mastercard-securecode.png", alt: "Mastercard SecureCode", w: 86, h: 40 },
  { src: "/images/platby/maestro.png", alt: "Maestro", w: 67, h: 43 },
];

type Plan = (typeof SUBSCRIPTION_PLANS)[number];

export function CheckoutForm({ plan }: { plan: Plan }) {
  const [consent, setConsent] = useState(false);
  const [state, formAction] = useActionState(
    confirmSubscriptionPaymentAction,
    INITIAL,
  );
  useFormRedirect(state);

  const frekvencia = plan.id === "MONTHLY" ? "raz mesačne" : "raz ročne";
  const perioda =
    plan.id === "MONTHLY" ? "každý mesiac odo dňa platby" : "každý rok odo dňa platby";

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col">
      <input type="hidden" name="plan" value={plan.id} />

      <div className="mt-4 flex flex-col gap-4 px-5 pb-4">
        {/* Zhrnutie objednávky */}
        <div
          className={cn(
            "w-full rounded-[24px] border-2 p-5 text-white shadow-soft",
            plan.accent === "primary"
              ? "border-brand-purple/30 bg-brand-purple"
              : "border-brand-pink/30 bg-brand-pink",
          )}
        >
          <p className="text-xs font-bold uppercase tracking-wide text-white/70">
            Vaša objednávka
          </p>
          <h2 className="mt-1 text-xl font-extrabold leading-tight">
            {plan.name}
          </h2>
          <p className="mt-3 text-2xl font-black leading-none">{plan.price}</p>
          <p className="mt-2 text-sm text-white/85">
            Opakovaná platba, {frekvencia}. Zrušte kedykoľvek v nastaveniach účtu.
          </p>
        </div>

        {/* Platobné metódy */}
        <div className="rounded-2xl border border-brand-purple/10 bg-white p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-purple/50">
            Platba prebehne cez
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {PAYMENT_LOGOS.map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="h-6 w-auto object-contain"
              />
            ))}
          </div>
        </div>

        {/* Parametre opakovanej platby — oddelené od obchodných podmienok */}
        <div className="rounded-2xl border border-brand-purple/10 bg-white p-4 text-sm text-brand-purple/80">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-purple/50">
            Parametre opakovanej platby
          </p>
          <dl className="flex flex-col gap-1.5">
            <Row label="Dôvod platby" value="Členský poplatok ONKO KLUB" />
            <Row label="Suma" value={`${plan.price} (fixná)`} />
            <Row label="Frekvencia strhávania" value={frekvencia} />
            <Row label="Dátum strhávania" value={perioda} />
            <Row
              label="Zmena alebo zrušenie"
              value="Kedykoľvek v nastaveniach účtu, alebo e-mailom na office@nierakovine.sk"
            />
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-brand-purple/60">
            Údaje vašej platobnej karty spracúva výhradne platobná brána GoPay
            podľa bezpečnostného štandardu PCI DSS Level 1. NIE RAKOVINE, o. z.
            k nim nemá prístup a neukladá ich.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 px-1">
          <input
            type="checkbox"
            name="consent"
            className="sr-only"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span
            className={cn(
              "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition",
              consent
                ? "border-brand-pink bg-brand-pink text-white"
                : "border-brand-pink/45 bg-white",
            )}
          >
            {consent && <CheckIcon />}
          </span>
          <span className="text-xs leading-snug text-brand-purple/80">
            Súhlasím so založením a uvedenými parametrami opakovanej platby a
            s uložením platobných údajov na strane platobnej brány GoPay. Prečítal/a
            som si{" "}
            <Link href="/podmienky" target="_blank" className="font-semibold underline">
              Obchodné podmienky
            </Link>
            .
          </span>
        </label>
      </div>

      <FormError message={state.message} />

      <div className="sticky bottom-0 shrink-0 border-t border-brand-purple/5 bg-white px-6 py-5">
        <SubmitButton
          disabled={!consent}
          className="mx-auto flex w-full max-w-[280px] items-center justify-center gap-2 rounded-pill bg-brand-pink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 disabled:opacity-40"
          pendingLabel="Spracúvam platbu…"
        >
          Zaplatiť cez GoPay
        </SubmitButton>
      </div>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-brand-purple/50">{label}</dt>
      <dd className="text-right font-semibold text-brand-purple">{value}</dd>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M3 8.5L6.5 12 13 5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
