"use client";

import { useActionState, useState } from "react";
import type { CancerType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { saveAboutYouAction, type ActionState } from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { LocationPicker } from "@/components/map/LocationPicker";
import { CancerTypeSelect } from "@/components/CancerTypeSelect";
import { useFormRedirect } from "@/hooks/useFormRedirect";

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

const PHASES = ["1. fáza", "2. fáza", "3. fáza", "4. fáza", "Remisia"];

const PATIENT_OPTIONS = [
  { value: "yes", label: "Áno, mám diagnózu" },
  { value: "no", label: "Nie, nie som pacient" },
] as const;

const INITIAL: ActionState = { ok: false };

/** Map a Nominatim region string ("Žilinský kraj") to one of our options. */
function matchRegion(raw: string | null): string {
  if (!raw) return "";
  const cleaned = raw.replace(/\s*kraj\s*/i, "").trim();
  return (
    REGIONS.find((r) =>
      cleaned.toLowerCase().startsWith(r.toLowerCase().slice(0, 6)),
    ) ?? ""
  );
}

export function AboutYouForm({
  defaultRegion,
  defaultCity,
  defaultLat,
  defaultLng,
  defaultIsPatient,
  defaultDiagnosis,
  defaultPhase,
  defaultYear,
  defaultCancerTypes,
}: {
  defaultRegion: string;
  defaultCity: string;
  defaultLat: number | null;
  defaultLng: number | null;
  defaultIsPatient: boolean | null;
  defaultDiagnosis: string;
  defaultPhase: string;
  defaultYear: number | null;
  defaultCancerTypes: CancerType[];
}) {
  const [state, formAction] = useActionState(saveAboutYouAction, INITIAL);
  const [region, setRegion] = useState(defaultRegion);
  const [city, setCity] = useState(defaultCity);
  const [isPatient, setIsPatient] = useState<"yes" | "no" | null>(
    defaultIsPatient === true ? "yes" : defaultIsPatient === false ? "no" : null,
  );
  useFormRedirect(state);

  return (
    <form action={formAction} className="mt-5 flex flex-col gap-6 px-5 pb-6">
      {/* Lokalita */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-brand-purple">
          Kde sa nachádzate?
        </h2>
        <select
          name="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="input-light py-3.5 text-lg text-brand-purple"
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
          className="input-light mt-3 text-base"
        />

        <p className="my-3 text-center text-sm text-brand-purple/60">
          Alebo vyberte miesto na mape:
        </p>

        <LocationPicker
          defaultLat={defaultLat}
          defaultLng={defaultLng}
          height="h-48"
          onResolved={({ city: c, region: r }) => {
            if (c) setCity(c);
            const matched = matchRegion(r);
            if (matched) setRegion(matched);
          }}
        />
      </div>

      {/* Status pacienta */}
      <div className="border-t border-brand-purple/10 pt-5">
        <h2 className="mb-3 text-lg font-bold text-brand-purple">
          Ste pacient s diagnózou?
        </h2>
        <input type="hidden" name="isPatient" value={isPatient ?? ""} />
        <ul className="flex flex-col divide-y divide-brand-purple/10 overflow-hidden rounded-2xl border border-brand-purple/10 bg-white">
          {PATIENT_OPTIONS.map((option) => {
            const active = isPatient === option.value;
            return (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-3 px-4 py-4">
                  <input
                    type="radio"
                    name="isPatient-visual"
                    value={option.value}
                    checked={active}
                    onChange={() => setIsPatient(option.value)}
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
                  <span className="text-base font-semibold text-brand-purple">
                    {option.label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Diagnóza — len ak je pacient */}
      {isPatient === "yes" && (
        <div className="flex flex-col gap-3 border-t border-brand-purple/10 pt-5">
          <h2 className="mb-1 text-lg font-bold text-brand-purple">
            Povedzte nám o svojej diagnóze
          </h2>
          <p className="mb-2 text-sm leading-relaxed text-brand-purple/60">
            Každý príbeh je iný. Táto informácia nám umožní ponúkať obsah a
            aktivity, ktoré môžu byť pre vás najviac užitočné.
          </p>

          <div>
            <label className="mb-1 block text-base font-medium text-brand-purple/80">
              Typ onkologického ochorenia
            </label>
            <div className="[&_button]:text-sm [&_p]:text-sm">
              <CancerTypeSelect
                defaultValue={defaultCancerTypes}
                helpText="Vyberte jeden alebo viac typov. Podľa toho vám prispôsobíme obsah, profily, fóra a aktivity."
              />
            </div>
          </div>

          <input
            name="diagnosis"
            type="text"
            defaultValue={defaultDiagnosis}
            placeholder="Spresnenie diagnózy (voliteľné)"
            className="input-light mt-2 text-base"
          />

          <div>
            <label
              className="mb-1 block text-base font-medium text-brand-purple/80"
              htmlFor="phase"
            >
              Fáza liečby
            </label>
            <select
              id="phase"
              name="phase"
              defaultValue={defaultPhase}
              className="input-light text-base text-brand-purple"
            >
              <option value="">Vyberte fázu</option>
              {PHASES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="mb-1 block text-base font-medium text-brand-purple/80"
              htmlFor="year"
            >
              Rok diagnostikovania
            </label>
            <input
              id="year"
              name="year"
              type="number"
              min="1950"
              max={new Date().getFullYear()}
              defaultValue={defaultYear ?? ""}
              placeholder="napr. 2024"
              className="input-light text-base"
            />
          </div>
        </div>
      )}

      <FormError message={state.message} />

      <div className="flex justify-center pb-2 pt-1">
        <SubmitButton
          className="btn-secondary !grid w-[94%] grid-cols-[1fr_auto_1fr] items-center !px-4 !py-3.5 text-base font-medium"
          pendingLabel="Ukladám…"
        >
          <>
            <span aria-hidden />
            <span>Ďalej</span>
            <Chevron className="justify-self-end" />
          </>
        </SubmitButton>
      </div>
    </form>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 shrink-0", className)}
      fill="none"
      aria-hidden
    >
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
