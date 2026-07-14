"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SubscriptionPlan } from "@prisma/client";
import {
  selectSubscriptionPlanAction,
  type ActionState,
} from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useFormRedirect } from "@/hooks/useFormRedirect";

const INITIAL: ActionState = { ok: false };

// GoPay vyžaduje viditeľné logá akceptovaných platobných metód priamo na
// stránke s cenou/produktom — nielen na samotnej platobnej obrazovke.
const PAYMENT_LOGOS = [
  { src: "/images/platby/gopay.png", alt: "GoPay", w: 100, h: 35 },
  { src: "/images/platby/visa.png", alt: "VISA", w: 67, h: 23 },
  { src: "/images/platby/verified-by-visa.png", alt: "Verified by VISA", w: 67, h: 30 },
  { src: "/images/platby/mastercard.png", alt: "Mastercard", w: 67, h: 43 },
  { src: "/images/platby/mastercard-securecode.png", alt: "Mastercard SecureCode", w: 86, h: 40 },
  { src: "/images/platby/maestro.png", alt: "Maestro", w: 67, h: 43 },
];

export function SubscriptionForm({
  currentPlan,
}: {
  currentPlan: SubscriptionPlan;
}) {
  const [selected, setSelected] = useState<"YEARLY" | "MONTHLY" | null>(
    currentPlan === "MONTHLY" || currentPlan === "YEARLY" ? currentPlan : null,
  );
  const [state, formAction] = useActionState(
    selectSubscriptionPlanAction,
    INITIAL,
  );
  useFormRedirect(state);

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col">
      <input type="hidden" name="plan" value={selected ?? ""} />

      <div className="mt-3 flex flex-col gap-4 px-5 pb-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const active = selected === plan.id;
          const isPrimary = plan.accent === "primary";
          return (
            <button
              type="button"
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={cn(
                "w-full rounded-[28px] border-2 p-5 text-white shadow-soft transition",
                isPrimary
                  ? "border-brand-purple/30 bg-brand-purple"
                  : "border-brand-pink/30 bg-brand-pink",
                active &&
                  (isPrimary
                    ? "ring-4 ring-brand-purple/25"
                    : "ring-4 ring-brand-pink/30"),
              )}
            >
              <h2 className="text-left text-2xl font-extrabold leading-tight tracking-tight">
                {plan.name}
              </h2>
              <p className="mt-2 text-left text-sm leading-relaxed text-white/95">
                {plan.description}
              </p>
              <p className="mt-4 text-left text-lg font-extrabold leading-none">
                {plan.price}
              </p>
              <p className="mt-2 text-left text-sm text-white/90">
                Zrušte kedykoľvek
              </p>

              <span
                className={cn(
                  "mt-4 flex w-full items-center justify-center rounded-pill bg-white py-3 text-sm font-bold",
                  isPrimary ? "text-brand-purple" : "text-brand-pink",
                )}
              >
                {active ? "Zvolené" : "Vybrať balíček"}
              </span>
            </button>
          );
        })}

        {/* Platobné metódy — vyžaduje GoPay na stránke s cenou/produktom */}
        <div className="rounded-2xl border border-brand-purple/10 bg-white p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-purple/50">
            Platba prebehne bezpečne cez
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
          <p className="mt-3 text-xs leading-relaxed text-brand-purple/60">
            Ceny sú konečné vrátane DPH, bez skrytých poplatkov. Prečítajte si{" "}
            <Link href="/podmienky" target="_blank" className="font-semibold underline">
              Obchodné podmienky
            </Link>
            .
          </p>
        </div>
      </div>

      <FormError message={state.message} />

      <div className="sticky bottom-0 shrink-0 border-t border-brand-purple/5 bg-white px-6 py-5">
        <SubmitButton
          className="mx-auto flex w-full max-w-[280px] items-center justify-center gap-2 rounded-pill bg-brand-pink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 disabled:opacity-60"
          pendingLabel="Ukladám…"
        >
          <>
            Ďalej
            <ChevronRight />
          </>
        </SubmitButton>
      </div>
    </form>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
