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

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4 rounded-2xl border border-brand-purple/10 bg-white p-6 shadow-card"
    >
      {event && <input type="hidden" name="id" value={event.id} />}
      {(profileId || event?.profileId) && (
        <input
          type="hidden"
          name="profileId"
          value={profileId ?? event?.profileId ?? ""}
        />
      )}

      <Field label="Názov" name="title" defaultValue={event?.title} />
      <Field
        label="Krátky popis"
        name="description"
        defaultValue={event?.description ?? ""}
        textarea
      />

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Kategória
        </span>
        <select
          name="category"
          defaultValue={event?.category ?? ""}
          className="w-full rounded-xl border border-brand-purple/20 bg-white px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
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
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Miesto (adresa)
        </span>
        <input
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-xl border border-brand-purple/20 bg-white px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
        />
      </label>

      <div>
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Poloha na mape (pre „aktivity v okolí“)
        </span>
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

      <div>
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Pre typ rakoviny
        </span>
        <CancerTypeSelect
          variant="admin"
          defaultValue={event?.cancerTypes ?? []}
          helpText="Prázdne = aktivita pre všetkých. Inak sa zobrazí najmä týmto používateľom."
        />
      </div>

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

      {mode === "edit" && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={event?.published}
          />
          Publikované (viditeľné v aplikácii)
        </label>
      )}

      <FormError message={state.message} />

      <div className="flex justify-end gap-2 pt-2">
        <SubmitButton
          className="rounded-pill bg-brand-purple px-5 py-2 text-sm font-semibold text-white"
          pendingLabel="Ukladám…"
        >
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
      <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={3}
          className="w-full rounded-xl border border-brand-purple/20 bg-white px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          className="w-full rounded-xl border border-brand-purple/20 bg-white px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
        />
      )}
    </label>
  );
}
