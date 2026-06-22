"use client";

import { useActionState } from "react";
import type { DiscountOffer } from "@prisma/client";
import {
  createDiscountOfferAction,
  updateDiscountOfferAction,
  type ActionState,
} from "@/lib/actions/admin-discount-partners";
import { OFFER_CARD_COLORS } from "@/lib/discount-category";
import { AdminImageField } from "@/components/AdminImageField";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function DiscountOfferForm({
  mode,
  partnerId,
  offer,
}: {
  mode: "create" | "edit";
  partnerId: string;
  offer?: DiscountOffer;
}) {
  const [state, formAction] = useActionState(
    mode === "create" ? createDiscountOfferAction : updateDiscountOfferAction,
    INITIAL,
  );

  const validUntilValue = offer?.validUntil
    ? offer.validUntil.toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="partnerId" value={partnerId} />
      {offer && <input type="hidden" name="id" value={offer.id} />}

      <fieldset className="admin-fieldset">
        <legend>Zľavová karta</legend>
        <Field label="Názov / popis zľavy" name="title" defaultValue={offer?.title} required />
        <Field
          label="Detail zľavy"
          name="description"
          defaultValue={offer?.description ?? ""}
          textarea
        />
        <Field
          label="Text zľavy (napr. „10 %“)"
          name="discountText"
          defaultValue={offer?.discountText ?? ""}
        />
        <Field
          label="Promo kód"
          name="promoCode"
          defaultValue={offer?.promoCode ?? ""}
        />
        <label className="block">
          <span className="admin-label">Farba karty</span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              name="accentColor"
              type="color"
              defaultValue={offer?.accentColor ?? OFFER_CARD_COLORS[0]}
              className="h-10 w-14 cursor-pointer rounded-lg border border-brand-purple/15"
            />
            <span className="text-xs text-brand-purple/55">
              Farba pozadia zľavovej karty v aplikácii
            </span>
          </div>
        </label>
        <AdminImageField
          name="imageUrl"
          uploadName="imageFile"
          label="Obrázok na karte (voliteľné)"
          defaultValue={offer?.imageUrl ?? ""}
          shape="rounded"
          previewAspect="video"
        />
        <Field
          label="Platí do"
          name="validUntil"
          type="date"
          defaultValue={validUntilValue}
        />
        <Field
          label="Poradie"
          name="sortOrder"
          type="number"
          defaultValue={String(offer?.sortOrder ?? 0)}
        />
      </fieldset>

      <label className="flex items-center gap-3 rounded-2xl bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
        <input
          type="checkbox"
          name="published"
          defaultChecked={offer?.published ?? true}
          className="h-4 w-4 accent-brand-purple"
        />
        Publikovaná zľava
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton className="admin-btn-primary" pendingLabel="Ukladám…">
          {mode === "create" ? "Vytvoriť kartu" : "Uložiť zmeny"}
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
  textarea,
  type,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
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
          required={required}
          className="admin-input"
        />
      )}
    </label>
  );
}
