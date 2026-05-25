"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Subscription selection. Matches reference: phone status bar look at top,
// two cards (pink + dark purple) with white "Vybrať balíček" buttons,
// "Ďalej" CTA in pink-soft at the bottom.
export default function SubscriptionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"YEARLY" | "MONTHLY" | null>(null);

  return (
    <PhoneShell>
      <header className="px-6 pt-8 text-center">
        <h1 className="text-[22px] font-extrabold leading-tight text-brand-pink">
          Zvoľte si formu
          <br />
          predplatného
        </h1>
        <p className="mt-3 text-left text-[11px] text-brand-purple/50">
          zuzka dopis
        </p>
      </header>

      <div className="mt-3 flex flex-1 flex-col gap-4 px-5">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const active = selected === plan.id;
          const isPrimary = plan.accent === "primary";
          return (
            <button
              type="button"
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={cn(
                "rounded-3xl p-5 text-left text-white shadow-soft transition",
                isPrimary ? "bg-brand-purple" : "bg-brand-pink-soft",
                active && "ring-4 ring-brand-purple/30",
              )}
            >
              <h2 className="text-lg font-extrabold">{plan.name}</h2>
              <p className="mt-1 text-[11px] leading-relaxed text-white/90">
                {plan.description}
              </p>
              <p className="mt-3 text-sm font-bold">{plan.price}</p>
              <p className="text-[11px] text-white/80">Zrušte kedykoľvek</p>

              <div className="mt-3">
                <span
                  className={cn(
                    "block rounded-pill bg-white py-2 text-center text-xs font-bold",
                    isPrimary ? "text-brand-purple" : "text-brand-pink",
                  )}
                >
                  {active ? "Zvolené" : "Vybrať balíček"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center px-6 py-6">
        <button
          type="button"
          disabled={!selected}
          onClick={() => router.push("/register/profile/location")}
          className="flex w-64 items-center justify-center gap-2 rounded-pill border border-brand-pink bg-brand-pink-soft px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-pink disabled:opacity-60"
        >
          Ďalej
          <ChevronRight />
        </button>
      </div>
    </PhoneShell>
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
