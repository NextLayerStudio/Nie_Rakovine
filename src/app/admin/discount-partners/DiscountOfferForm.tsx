"use client";

import { useActionState } from "react";
import type { DiscountOffer } from "@prisma/client";
import {
  createDiscountOfferAction,
  updateDiscountOfferAction,
  type ActionState,
} from "@/lib/actions/admin-discount-partners";
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

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="partnerId" value={partnerId} />
      {offer && <input type="hidden" name="id" value={offer.id} />}

      <fieldset className="admin-fieldset">
        <legend>Zľavová karta</legend>
        <p className="mb-4 text-xs text-brand-purple/60">
          Zľavová karta je iba obrázok. Nahrajte hotovú grafiku karty.
        </p>
        <AdminImageField
          name="imageUrl"
          uploadName="imageFile"
          label="Obrázok karty"
          defaultValue={offer?.imageUrl ?? ""}
          shape="rounded"
          previewAspect="video"
        />
        <label className="block">
          <span className="admin-label">Poradie</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={String(offer?.sortOrder ?? 0)}
            className="admin-input"
          />
        </label>
      </fieldset>

      <label className="flex items-center gap-3 rounded-lg bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
        <input
          type="checkbox"
          name="published"
          defaultChecked={offer?.published ?? true}
          className="h-4 w-4 accent-brand-purple"
        />
        Publikovaná karta
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
