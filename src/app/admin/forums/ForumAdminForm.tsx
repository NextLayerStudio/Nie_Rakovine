"use client";

import { useActionState } from "react";
import {
  createForumAction,
  updateForumAction,
  type ActionState,
} from "@/lib/actions/admin-forums";
import { AdminImageField } from "@/components/AdminImageField";
import { CancerTypeSelect } from "@/components/CancerTypeSelect";
import { FormError, SubmitButton } from "@/components/FormError";
import type { Forum } from "@prisma/client";

const INITIAL: ActionState = { ok: false };

export function ForumAdminForm({
  mode,
  forum,
}: {
  mode: "create" | "edit";
  forum?: Forum;
}) {
  const [state, formAction] = useActionState(
    mode === "create" ? createForumAction : updateForumAction,
    INITIAL,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {forum && <input type="hidden" name="id" value={forum.id} />}

      <fieldset className="admin-fieldset">
        <legend>Detail fóra</legend>
        <label className="block">
          <span className="admin-label">Názov fóra</span>
          <input
            name="title"
            required
            defaultValue={forum?.title}
            className="admin-input"
          />
        </label>

        <label className="block">
          <span className="admin-label">Popis</span>
          <textarea
            name="description"
            rows={3}
            defaultValue={forum?.description ?? ""}
            className="admin-input"
          />
        </label>

        <div>
          <span className="admin-label">Pre typ rakoviny</span>
          <CancerTypeSelect
            variant="admin"
            defaultValue={forum?.cancerTypes ?? []}
            helpText="Prázdne = fórum pre všetkých. Inak sa zobrazí najmä týmto používateľom."
          />
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Vzhľad</legend>
        <AdminImageField
          name="imageUrl"
          label="Profilová fotka fóra"
          hint="Zobrazí sa v zozname fór v aplikácii. Ak prázdne, použije sa farba nižšie."
          defaultValue={forum?.imageUrl ?? ""}
          shape="circle"
        />

        <label className="block">
          <span className="admin-label">Farba zálohy (hex)</span>
          <p className="mb-2 text-[11px] text-brand-purple/55">
            Použije sa, keď nie je nastavená profilová fotka.
          </p>
          <input
            name="accentColor"
            defaultValue={forum?.accentColor ?? "#6F2380"}
            className="admin-input"
          />
        </label>
      </fieldset>

      <label className="flex items-center gap-3 rounded-lg bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
        <input
          type="checkbox"
          name="published"
          defaultChecked={forum?.published ?? true}
          className="h-4 w-4 accent-brand-purple"
        />
        Publikované (viditeľné v aplikácii)
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton className="admin-btn-primary" pendingLabel="Ukladám…">
          {mode === "create" ? "Vytvoriť fórum" : "Uložiť"}
        </SubmitButton>
        <FormError message={state.message} />
      </div>
    </form>
  );
}
