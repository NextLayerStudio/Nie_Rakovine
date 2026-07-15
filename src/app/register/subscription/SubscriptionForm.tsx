"use client";

import { useActionState, useEffect, useState } from "react";
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
import { PRESELECTED_PLAN_KEY } from "@/lib/preselected-plan";

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

type PlanId = (typeof SUBSCRIPTION_PLANS)[number]["id"];

export function SubscriptionForm({
  currentPlan,
}: {
  currentPlan: SubscriptionPlan;
}) {
  const [selected, setSelected] = useState<PlanId | null>(
    SUBSCRIPTION_PLANS.some((p) => p.id === currentPlan)
      ? (currentPlan as PlanId)
      : null,
  );
  const [state, formAction] = useActionState(
    selectSubscriptionPlanAction,
    INITIAL,
  );
  useFormRedirect(state);

  // If nothing is chosen yet, honour a plan picked earlier on a public
  // marketing page (e.g. the Supporter amount slider on /cennik).
  useEffect(() => {
    if (selected) return;
    const stored = sessionStorage.getItem(PRESELECTED_PLAN_KEY);
    if (stored && SUBSCRIPTION_PLANS.some((p) => p.id === stored)) {
      setSelected(stored as PlanId);
    }
    sessionStorage.removeItem(PRESELECTED_PLAN_KEY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col">
      <input type="hidden" name="plan" value={selected ?? ""} />

      <div className="mt-3 flex flex-col gap-4 px-5 pb-4">
        <ul className="flex flex-col divide-y divide-brand-purple/10 overflow-hidden rounded-2xl border border-brand-purple/10 bg-white">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const active = selected === plan.id;
            return (
              <li key={plan.id}>
                <label className="flex cursor-pointer items-center gap-3 px-4 py-4">
                  <input
                    type="radio"
                    name="plan-visual"
                    value={plan.id}
                    checked={active}
                    onChange={() => setSelected(plan.id)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition",
                      active ? "border-brand-pink" : "border-brand-purple/25",
                    )}
                  >
                    {active && (
                      <span className="h-2.5 w-2.5 rounded-full bg-brand-pink" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-brand-purple">
                      {plan.name}
                    </span>
                    <span className="block text-xs leading-snug text-brand-purple/55">
                      {plan.description}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-brand-purple">
                    {plan.price}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

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
