"use client";

import { useActionState } from "react";
import { saveLocationAction, type ActionState } from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";

const REGIONS = [
  "Bratislavský",
  "Trnavský",
  "Trenčiansky",
  "Nitriansky",
  "Žilinský",
  "Banskobystrický",
  "Prešovský",
  "Košický",
];

const INITIAL: ActionState = { ok: false };

export function LocationForm({
  defaultRegion,
  defaultCity,
}: {
  defaultRegion: string;
  defaultCity: string;
}) {
  const [state, formAction] = useActionState(saveLocationAction, INITIAL);

  return (
    <form action={formAction} className="mt-5 flex flex-1 flex-col px-5">
      <select
        name="region"
        defaultValue={defaultRegion}
        className="input-light text-brand-purple"
      >
        <option value="">Vyberte kraj</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <input
        name="city"
        type="text"
        defaultValue={defaultCity}
        placeholder="Mesto (voliteľné)"
        className="input-light mt-3"
      />

      <p className="my-3 text-center text-xs text-brand-purple/60">
        alebo vyberte na mape
      </p>

      <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-[#e8e1d8]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(111,35,128,0.18) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-purple text-white shadow-lg">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9.5A2.5 2.5 0 1012 6a2.5 2.5 0 000 5.5z" />
          </svg>
        </div>
      </div>

      <FormError message={state.message} />

      <div className="mt-auto py-4">
        <SubmitButton
          className="btn-secondary mx-auto flex w-40 justify-between"
          pendingLabel="Ukladám…"
        >
          <>
            Ďalej
            <Chevron />
          </>
        </SubmitButton>
      </div>
    </form>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
