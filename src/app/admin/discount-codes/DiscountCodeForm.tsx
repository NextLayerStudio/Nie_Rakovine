"use client";

import { useActionState } from "react";
import type { MembershipDiscountCode } from "@prisma/client";
import {
  createDiscountCodeAction,
  updateDiscountCodeAction,
  type ActionState,
} from "@/lib/actions/admin-discount-codes";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function DiscountCodeForm({
  mode,
  discountCode,
}: {
  mode: "create" | "edit";
  discountCode?: MembershipDiscountCode;
}) {
  const [state, formAction] = useActionState(
    mode === "create" ? createDiscountCodeAction : updateDiscountCodeAction,
    INITIAL,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {discountCode && (
        <input type="hidden" name="id" value={discountCode.id} />
      )}

      <fieldset className="admin-fieldset">
        <legend>Detail zľavového kódu</legend>

        <label className="block">
          <span className="admin-label">Kód</span>
          <input
            name="code"
            required
            placeholder="napr. PARTNER2026"
            defaultValue={discountCode?.code}
            className="admin-input uppercase"
          />
        </label>

        <label className="block">
          <span className="admin-label">Typ zľavy</span>
          <select
            name="type"
            defaultValue={discountCode?.type ?? "PERCENT"}
            className="admin-input"
          >
            <option value="PERCENT">Percentuálna (%)</option>
            <option value="FIXED">Pevná suma (€)</option>
          </select>
        </label>

        <label className="block">
          <span className="admin-label">Výška zľavy</span>
          <p className="mb-2 text-[11px] text-brand-purple/55">
            Pri percentuálnej zľave zadajte číslo 1-100 (100 = úplne zadarmo).
            Pri pevnej sume zadajte sumu v eurách.
          </p>
          <input
            name="amount"
            type="number"
            min="1"
            required
            defaultValue={discountCode?.amount}
            className="admin-input"
          />
        </label>
      </fieldset>

      <label className="flex items-center gap-3 rounded-lg bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
        <input
          type="checkbox"
          name="active"
          defaultChecked={discountCode?.active ?? true}
          className="h-4 w-4 accent-brand-purple"
        />
        Aktívny (dá sa uplatniť pri platbe)
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton className="admin-btn-primary" pendingLabel="Ukladám…">
          {mode === "create" ? "Vytvoriť kód" : "Uložiť"}
        </SubmitButton>
        <FormError message={state.message} />
      </div>
    </form>
  );
}
