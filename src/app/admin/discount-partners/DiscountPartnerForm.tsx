"use client";

import { useActionState } from "react";
import type { DiscountPartner } from "@prisma/client";
import {
  createDiscountPartnerAction,
  updateDiscountPartnerAction,
  type ActionState,
} from "@/lib/actions/admin-discount-partners";
import {
  DISCOUNT_CATEGORIES,
  categoryLabel,
} from "@/lib/discount-category";
import { AdminImageField } from "@/components/AdminImageField";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function DiscountPartnerForm({
  mode,
  partner,
}: {
  mode: "create" | "edit";
  partner?: DiscountPartner;
}) {
  const [state, formAction] = useActionState(
    mode === "create" ? createDiscountPartnerAction : updateDiscountPartnerAction,
    INITIAL,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {partner && <input type="hidden" name="id" value={partner.id} />}

      <fieldset className="admin-fieldset">
        <legend>Základné údaje</legend>
        <Field
          label="Názov značky"
          name="displayName"
          defaultValue={partner?.displayName}
          required
        />
        <Field
          label="Identifikátor (URL)"
          name="handle"
          defaultValue={partner?.handle}
          placeholder="nazov-znacky"
          required
        />
        <Field
          label="Popis"
          name="bio"
          defaultValue={partner?.bio ?? ""}
          textarea
        />

        <label className="block">
          <span className="admin-label">Kategória</span>
          <select
            name="category"
            defaultValue={partner?.category ?? "MODA"}
            className="admin-input"
            required
          >
            {DISCOUNT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-brand-purple/55">
            Určuje, v ktorej kategórii sa značka zobrazí v sekcii Zľavy.
          </p>
        </label>

        <Field
          label="Poradie (nižšie = vyššie)"
          name="sortOrder"
          type="number"
          defaultValue={String(partner?.sortOrder ?? 0)}
        />
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Obrázky</legend>
        <AdminImageField
          name="avatarUrl"
          uploadName="avatarFile"
          label="Logo značky"
          hint="Kruhové logo zobrazené v Zľavy."
          defaultValue={partner?.avatarUrl ?? ""}
          shape="circle"
        />
        <AdminImageField
          name="coverUrl"
          uploadName="coverFile"
          label="Titulný obrázok"
          hint="Voliteľný banner značky."
          defaultValue={partner?.coverUrl ?? ""}
          shape="rounded"
        />
      </fieldset>

      <label className="flex items-center gap-3 rounded-2xl bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={partner?.featured ?? false}
          className="h-4 w-4 accent-brand-purple"
        />
        Odporúčaná značka (zobrazí sa hore na úvodnej stránke Zľavy)
      </label>

      <label className="flex items-center gap-3 rounded-2xl bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
        <input
          type="checkbox"
          name="published"
          defaultChecked={partner?.published ?? true}
          className="h-4 w-4 accent-brand-purple"
        />
        Publikovaná značka (viditeľná v aplikácii)
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton className="admin-btn-primary" pendingLabel="Ukladám…">
          Uložiť
        </SubmitButton>
        <FormError message={state.ok ? undefined : state.message} />
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  textarea,
  type,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          defaultValue={defaultValue}
          className="admin-input"
        />
      ) : (
        <input
          name={name}
          type={type ?? "text"}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className="admin-input"
        />
      )}
    </label>
  );
}
