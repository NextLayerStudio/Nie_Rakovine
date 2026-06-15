"use client";

import { useActionState, useState } from "react";
import { saveLocationAction, type ActionState } from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { LocationPicker } from "@/components/map/LocationPicker";

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

/** Map a Nominatim region string ("Žilinský kraj") to one of our options. */
function matchRegion(raw: string | null): string {
  if (!raw) return "";
  const cleaned = raw.replace(/\s*kraj\s*/i, "").trim();
  return REGIONS.find((r) => cleaned.toLowerCase().startsWith(r.toLowerCase().slice(0, 6))) ?? "";
}

export function LocationForm({
  defaultRegion,
  defaultCity,
  defaultLat,
  defaultLng,
}: {
  defaultRegion: string;
  defaultCity: string;
  defaultLat: number | null;
  defaultLng: number | null;
}) {
  const [state, formAction] = useActionState(saveLocationAction, INITIAL);
  const [region, setRegion] = useState(defaultRegion);
  const [city, setCity] = useState(defaultCity);

  return (
    <form action={formAction} className="mt-5 flex flex-1 flex-col px-5">
      <select
        name="region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
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
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Mesto (voliteľné)"
        className="input-light mt-3"
      />

      <p className="my-3 text-center text-xs text-brand-purple/60">
        Alebo vyberte miesto na mape:
      </p>

      <LocationPicker
        defaultLat={defaultLat}
        defaultLng={defaultLng}
        height="h-56"
        onResolved={({ city: c, region: r }) => {
          if (c) setCity(c);
          const matched = matchRegion(r);
          if (matched) setRegion(matched);
        }}
      />

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
