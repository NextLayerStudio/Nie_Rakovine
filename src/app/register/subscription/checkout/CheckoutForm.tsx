"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  confirmSubscriptionPaymentAction,
  previewDiscountCodeAction,
  type ActionState,
  type DiscountPreviewState,
} from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { SUBSCRIPTION_PLANS, SUPPORTER_MIN_AMOUNT_EUR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useFormRedirect } from "@/hooks/useFormRedirect";
import { PRESELECTED_AMOUNT_KEY } from "@/lib/preselected-plan";

const INITIAL: ActionState = { ok: false };
const DISCOUNT_INITIAL: DiscountPreviewState = { ok: false };

const PAYMENT_LOGOS = [
  { src: "/images/platby/visa.png", alt: "VISA", w: 67, h: 23 },
  { src: "/images/platby/verified-by-visa.png", alt: "Verified by VISA", w: 67, h: 30 },
  { src: "/images/platby/mastercard.png", alt: "Mastercard", w: 67, h: 43 },
  { src: "/images/platby/mastercard-securecode.png", alt: "Mastercard SecureCode", w: 86, h: 40 },
  { src: "/images/platby/maestro.png", alt: "Maestro", w: 67, h: 43 },
];

type Plan = (typeof SUBSCRIPTION_PLANS)[number];

export function CheckoutForm({
  plan,
  initialAmount,
  initialError,
  isUpgrade = false,
}: {
  plan: Plan;
  initialAmount?: number;
  initialError?: string;
  isUpgrade?: boolean;
}) {
  const [consent, setConsent] = useState(false);
  const [amount, setAmount] = useState(initialAmount ?? plan.priceEuro);
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "BANK_TRANSFER">(
    "CARD",
  );
  const [state, formAction] = useActionState(
    confirmSubscriptionPaymentAction,
    INITIAL,
  );
  const [discountState, discountAction] = useActionState(
    previewDiscountCodeAction,
    DISCOUNT_INITIAL,
  );
  useFormRedirect(state);

  // Honour a Supporter amount chosen earlier via the slider on /cennik
  // (register flow only — the login flow already gets it via ?amount=).
  useEffect(() => {
    if (!plan.customAmount || initialAmount !== undefined) return;
    const stored = Number(sessionStorage.getItem(PRESELECTED_AMOUNT_KEY));
    if (Number.isFinite(stored) && stored >= SUPPORTER_MIN_AMOUNT_EUR) {
      setAmount(Math.round(stored));
    }
    sessionStorage.removeItem(PRESELECTED_AMOUNT_KEY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frekvencia = plan.id === "MONTHLY" ? "raz mesačne" : "raz ročne";
  const perioda =
    plan.id === "MONTHLY" ? "každý mesiac odo dňa platby" : "každý rok odo dňa platby";
  const discountApplied =
    discountState.ok && discountState.finalPriceEuro !== undefined;
  const finalPriceLabel = discountApplied
    ? `${discountState.finalPriceEuro} €`
    : plan.price;

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col">
      <input type="hidden" name="plan" value={plan.id} />
      <input type="hidden" name="paymentMethod" value={paymentMethod} />
      {isUpgrade && <input type="hidden" name="upgrade" value="1" />}

      <div className="mt-4 flex flex-col gap-4 px-5 pb-4">
        {/* Zhrnutie objednávky */}
        <div
          className={cn(
            "w-full rounded-[24px] border-2 p-5 text-white shadow-soft",
            plan.accent === "secondary"
              ? "border-brand-pink/30 bg-brand-pink"
              : "border-brand-purple/30 bg-brand-purple",
          )}
        >
          <p className="text-xs font-bold uppercase tracking-wide text-white/70">
            Vaša objednávka
          </p>
          <h2 className="mt-1 text-xl font-extrabold leading-tight">
            {plan.name}
          </h2>

          {plan.customAmount ? (
            <>
              <p className="mt-3 text-2xl font-black leading-none">{amount} €</p>
              <p className="mt-2 text-sm text-white/85">
                Jednorazová platba. Získate prístup na 1 rok, rovnako ako pri
                ročnom členstve.
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 flex items-baseline gap-2 text-2xl font-black leading-none">
                {finalPriceLabel}
                {discountApplied && (
                  <span className="text-sm font-semibold text-white/60 line-through">
                    {plan.price}
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm text-white/85">
                Opakovaná platba, {frekvencia}. Zrušte kedykoľvek v nastaveniach účtu.
              </p>
            </>
          )}
        </div>

        {plan.customAmount && (
          <div className="rounded-2xl border border-brand-purple/10 bg-white p-4">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-brand-purple/50"
              htmlFor="amount"
            >
              Suma podpory (min. {SUPPORTER_MIN_AMOUNT_EUR} €)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="amount"
                name="amount"
                type="number"
                min={SUPPORTER_MIN_AMOUNT_EUR}
                step={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="input-light flex-1 text-base"
              />
              <span className="text-lg font-bold text-brand-purple">€</span>
            </div>
          </div>
        )}

        {/* Spôsob platby */}
        <div className="px-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-purple/50">
            Spôsob platby
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("CARD")}
              className={cn(
                "rounded-2xl border-2 p-3 text-left transition",
                paymentMethod === "CARD"
                  ? "border-brand-pink bg-brand-pink/5"
                  : "border-brand-purple/10 bg-white",
              )}
            >
              <p className="text-sm font-bold text-brand-purple">Platobná brána</p>
              <p className="mt-0.5 text-xs text-brand-purple/50">Kartou online</p>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("BANK_TRANSFER")}
              className={cn(
                "rounded-2xl border-2 p-3 text-left transition",
                paymentMethod === "BANK_TRANSFER"
                  ? "border-brand-pink bg-brand-pink/5"
                  : "border-brand-purple/10 bg-white",
              )}
            >
              <p className="text-sm font-bold text-brand-purple">Bankový prevod</p>
              <p className="mt-0.5 text-xs text-brand-purple/50">QR kód alebo ručne</p>
            </button>
          </div>

          {paymentMethod === "CARD" ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
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
          ) : (
            <p className="mt-4 text-xs leading-relaxed text-brand-purple/60">
              V ďalšom kroku vám zobrazíme QR kód aj platobné údaje na ručné
              opísanie (IBAN, suma, variabilný symbol). Členstvo aktivujeme,
              keď platbu prijmeme na účet.
            </p>
          )}
        </div>

        {!plan.customAmount && (
          <>
            {/* Zľavový kód */}
            <div className="rounded-2xl border border-brand-purple/10 bg-white p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-purple/50">
                Zľavový kód (voliteľné)
              </p>
              <div className="flex items-center gap-2">
                <input
                  name="discountCode"
                  placeholder="napr. PARTNER2026"
                  className="input-light flex-1 text-sm uppercase"
                />
                <button
                  type="submit"
                  formAction={discountAction}
                  className="shrink-0 rounded-pill bg-brand-purple/10 px-4 py-2.5 text-xs font-bold text-brand-purple transition hover:bg-brand-purple/15"
                >
                  Uplatniť
                </button>
              </div>
              {discountState.message && (
                <p
                  className={cn(
                    "mt-2 text-xs",
                    discountState.ok ? "text-emerald-600" : "text-red-500",
                  )}
                >
                  {discountState.ok
                    ? `Kód uplatnený: ${discountState.discountLabel}`
                    : discountState.message}
                </p>
              )}
            </div>

            {/* Parametre opakovanej platby — oddelené od obchodných podmienok */}
            <div className="rounded-2xl border border-brand-purple/10 bg-white p-4 text-sm text-brand-purple/80">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-purple/50">
                Parametre opakovanej platby
              </p>
              <dl className="flex flex-col gap-1.5">
                <Row label="Dôvod platby" value="Členský poplatok ONKO KLUB" />
                <Row
                  label="Suma"
                  value={`${finalPriceLabel} (fixná)${discountApplied ? " — so zľavovým kódom" : ""}`}
                />
                <Row label="Frekvencia strhávania" value={frekvencia} />
                <Row label="Dátum strhávania" value={perioda} />
                <Row
                  label="Zmena alebo zrušenie"
                  value="Kedykoľvek v nastaveniach účtu, alebo e-mailom na info@onkoklub.sk"
                />
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-brand-purple/60">
                {paymentMethod === "CARD" ? (
                  <>
                    Údaje vašej platobnej karty spracúva výhradne platobná brána
                    Nexi podľa bezpečnostného štandardu PCI DSS Level 1. NIE
                    RAKOVINE, o. z. k nim nemá prístup a neukladá ich.
                  </>
                ) : (
                  <>
                    Platba prebehne bankovým prevodom na účet ONKO KLUB.
                    Členstvo aktivujeme po prijatí platby na účet.
                  </>
                )}
              </p>
            </div>
          </>
        )}

        {plan.customAmount && (
          <p className="rounded-2xl border border-brand-purple/10 bg-white p-4 text-xs leading-relaxed text-brand-purple/60">
            {paymentMethod === "CARD" ? (
              <>
                Údaje vašej platobnej karty spracúva výhradne platobná brána
                Nexi podľa bezpečnostného štandardu PCI DSS Level 1. NIE
                RAKOVINE, o. z. k nim nemá prístup a neukladá ich.
              </>
            ) : (
              <>
                Platba prebehne bankovým prevodom na účet ONKO KLUB
                Členstvo aktivujeme po prijatí platby na účet.
              </>
            )}
          </p>
        )}

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
            {paymentMethod === "BANK_TRANSFER" ? (
              <>
                Súhlasím so zaplatením uvedenej sumy bankovým prevodom na účet
                ONKO KLUB.
              </>
            ) : plan.customAmount ? (
              <>
                Súhlasím so zaplatením uvedenej sumy a s uložením platobných
                údajov na strane platobnej brány Nexi.
              </>
            ) : (
              <>
                Súhlasím so založením a uvedenými parametrami opakovanej platby a
                s uložením platobných údajov na strane platobnej brány Nexi.
              </>
            )}{" "}
            Prečítal/a som si{" "}
            <Link href="/obchodne-podmienky" target="_blank" className="font-semibold underline">
              Obchodné podmienky
            </Link>
            .
          </span>
        </label>
      </div>

      <FormError message={state.message || initialError} />

      <div className="sticky bottom-0 shrink-0 border-t border-brand-purple/5 bg-white px-6 py-5">
        <SubmitButton
          disabled={!consent}
          className="mx-auto flex w-full max-w-[280px] items-center justify-center gap-2 rounded-pill bg-brand-pink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 disabled:opacity-40"
          pendingLabel="Spracúvam platbu…"
        >
          {paymentMethod === "BANK_TRANSFER"
            ? "Pokračovať na platobné údaje"
            : plan.customAmount
              ? "Podporiť cez Nexi"
              : "Zaplatiť cez Nexi"}
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
