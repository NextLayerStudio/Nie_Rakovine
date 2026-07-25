"use client";

import { useActionState, useState } from "react";
import { Link2, Check } from "lucide-react";
import type { Event } from "@prisma/client";
import {
  createEventAction,
  updateEventAction,
  type ActionState,
} from "@/lib/actions/events";
import { FormError, SubmitButton } from "@/components/FormError";
import { LocationPicker } from "@/components/map/LocationPicker";
import { CancerTypeSelect } from "@/components/CancerTypeSelect";
import { AdminImageField } from "@/components/AdminImageField";
import { EVENT_CATEGORIES, EVENT_CATEGORY_META } from "@/lib/event-category";
import { EVENT_REGIONS, EVENT_REGION_LABELS } from "@/lib/event-region";
import { toZonedDateTimeLocal } from "@/lib/timezone";

const INITIAL: ActionState = { ok: false };

function toLocalDateTime(d: Date | null | undefined) {
  return d ? toZonedDateTimeLocal(d) : "";
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
    <form action={formAction} className="space-y-6">
      {event && (
        <>
          <input type="hidden" name="id" value={event.id} />
          <CopyLinkButton eventId={event.id} />
        </>
      )}
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

        <label className="block">
          <span className="admin-label">Región</span>
          <select
            name="region"
            defaultValue={event?.region ?? ""}
            className="admin-input"
          >
            <option value="">— bez regiónu —</option>
            {EVENT_REGIONS.map((r) => (
              <option key={r} value={r}>
                {EVENT_REGION_LABELS[r]}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="admin-label">
            Poloha na mape (pre „aktivity v okolí“)
          </span>
          <div className="overflow-hidden rounded-md ring-1 ring-brand-purple/10">
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

        <Field
          label="Kapacita"
          name="capacity"
          type="number"
          defaultValue={event?.capacity?.toString() ?? ""}
        />

        <AdminImageField
          name="coverUrl"
          uploadName="coverFile"
          label="Titulný obrázok"
          hint="Náhľad podujatia. Fotka sa vždy oreže na pomer 16:9, aby sedela rovnako všade v appke aj na webe."
          defaultValue={event?.coverUrl ?? ""}
          shape="rounded"
          previewAspect="video"
          mandatoryAspect
        />
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Prístupnosť</legend>
        <label className="block">
          <span className="admin-label">Kto vidí toto podujatie na verejnom webe</span>
          <select
            name="visibility"
            defaultValue={event?.visibility ?? "PUBLIC"}
            className="admin-input"
          >
            <option value="PUBLIC">Prístupné všetkým</option>
            <option value="MEMBERS_ONLY">Prístupné len členom ONKO KLUBU</option>
          </select>
        </label>
      </fieldset>

      {mode === "edit" && (
        <label className="flex items-center gap-3 rounded-lg bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
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

function CopyLinkButton({ eventId }: { eventId: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        const url = `${window.location.origin}/podujatia/${eventId}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 px-3 py-1.5 text-xs font-semibold text-brand-purple hover:bg-brand-purple/10"
    >
      {copied ? <Check size={13} /> : <Link2 size={13} />}
      {copied ? "Skopírované" : "Kopírovať link na podujatie"}
    </button>
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
