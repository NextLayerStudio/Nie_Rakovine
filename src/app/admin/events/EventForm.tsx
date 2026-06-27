"use client";

import { useActionState, useState } from "react";
import type { Event } from "@prisma/client";
import {
  createEventAction,
  updateEventAction,
  type ActionState,
} from "@/lib/actions/events";
import { FormError, SubmitButton } from "@/components/FormError";
import { LocationPicker } from "@/components/map/LocationPicker";
import { CancerTypeSelect } from "@/components/CancerTypeSelect";
import { EVENT_CATEGORIES, EVENT_CATEGORY_META } from "@/lib/event-category";

const INITIAL: ActionState = { ok: false };

function toLocalDateTime(d: Date | null | undefined) {
  if (!d) return "";
  const offset = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

export function EventForm({
  mode,
  event,
  profileId,
}: {
  mode: "create" | "edit";
  event?: Event;
  profileId?: string;
}) {
  const [state, formAction] = useActionState(
    mode === "create" ? createEventAction : updateEventAction,
    INITIAL,
  );
  const [location, setLocation] = useState(event?.location ?? "");
  const [isPaid, setIsPaid] = useState(event?.isPaid ?? false);

  const defaultPrice =
    event?.priceCents != null ? (event.priceCents / 100).toFixed(2) : "";

  return (
    <form action={formAction} className="space-y-6">
      {event && <input type="hidden" name="id" value={event.id} />}
      {(profileId || event?.profileId) && (
        <input
          type="hidden"
          name="profileId"
          value={profileId ?? event?.profileId ?? ""}
        />
      )}

      <fieldset className="admin-fieldset">
        <legend>Detail podujatia</legend>
        <Field label="Názov" name="title" defaultValue={event?.title} />
        <Field
          label="Krátky popis"
          name="description"
          defaultValue={event?.description ?? ""}
          textarea
        />

        <label className="block">
          <span className="admin-label">Kategória</span>
          <select
            name="category"
            defaultValue={event?.category ?? ""}
            className="admin-input"
          >
            <option value="">— bez kategórie —</option>
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {EVENT_CATEGORY_META[c].label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Začiatok"
            name="startsAt"
            type="datetime-local"
            defaultValue={toLocalDateTime(event?.startsAt)}
          />
          <Field
            label="Koniec"
            name="endsAt"
            type="datetime-local"
            defaultValue={toLocalDateTime(event?.endsAt)}
          />
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Miesto</legend>
        <label className="block">
          <span className="admin-label">Miesto (adresa)</span>
          <input
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="admin-input"
          />
        </label>

        <div>
          <span className="admin-label">
            Poloha na mape (pre „aktivity v okolí“)
          </span>
          <div className="overflow-hidden rounded-xl ring-1 ring-brand-purple/10">
            <LocationPicker
              defaultLat={event?.latitude ?? null}
              defaultLng={event?.longitude ?? null}
              height="h-72"
              onResolved={({ city, region }) => {
                const label = [city, region].filter(Boolean).join(", ");
                if (label && !location.trim()) setLocation(label);
              }}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Cielenie a kapacita</legend>
        <div>
          <span className="admin-label">Pre typ rakoviny</span>
          <CancerTypeSelect
            variant="admin"
            defaultValue={event?.cancerTypes ?? []}
            helpText="Prázdne = aktivita pre všetkých. Inak sa zobrazí najmä týmto používateľom."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Kapacita"
            name="capacity"
            type="number"
            defaultValue={event?.capacity?.toString() ?? ""}
          />
          <Field
            label="Cover (URL)"
            name="coverUrl"
            defaultValue={event?.coverUrl ?? ""}
          />
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Platba</legend>
        <label className="flex items-center gap-3 rounded-2xl bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
          <input
            type="checkbox"
            name="isPaid"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
            className="h-4 w-4 accent-brand-purple"
          />
          Platené podujatie (registrácia až po zaplatení)
        </label>

        {isPaid && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="admin-label">Suma (EUR)</span>
              <input
                name="price"
                type="text"
                inputMode="decimal"
                defaultValue={defaultPrice}
                placeholder="napr. 25,00"
                required
                className="admin-input"
              />
            </label>
            <input type="hidden" name="currency" value={event?.currency ?? "EUR"} />
          </div>
        )}
      </fieldset>

      {mode === "edit" && (
        <label className="flex items-center gap-3 rounded-2xl bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
          <input
            type="checkbox"
            name="published"
            defaultChecked={event?.published}
            className="h-4 w-4 accent-brand-purple"
          />
          Publikované (viditeľné v aplikácii)
        </label>
      )}

      <FormError message={state.message} />

      <div className="flex justify-end gap-2">
        <SubmitButton className="admin-btn-primary" pendingLabel="Ukladám…">
          {mode === "create" ? "Vytvoriť" : "Uložiť zmeny"}
        </SubmitButton>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={3}
          className="admin-input"
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          className="admin-input"
        />
      )}
    </label>
  );
}
