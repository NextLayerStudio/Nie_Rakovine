"use client";

import { useActionState } from "react";
import type { Event } from "@prisma/client";
import {
  createEventAction,
  updateEventAction,
  type ActionState,
} from "@/lib/actions/events";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

function toLocalDateTime(d: Date | null | undefined) {
  if (!d) return "";
  const offset = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

export function EventForm({
  mode,
  event,
}: {
  mode: "create" | "edit";
  event?: Event;
}) {
  const [state, formAction] = useActionState(
    mode === "create" ? createEventAction : updateEventAction,
    INITIAL,
  );

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4 rounded-2xl border border-brand-purple/10 bg-white p-6 shadow-card"
    >
      {event && <input type="hidden" name="id" value={event.id} />}

      <Field label="Názov" name="title" defaultValue={event?.title} />
      <Field
        label="Krátky popis"
        name="description"
        defaultValue={event?.description ?? ""}
        textarea
      />
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
      <Field
        label="Miesto"
        name="location"
        defaultValue={event?.location ?? ""}
      />
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
