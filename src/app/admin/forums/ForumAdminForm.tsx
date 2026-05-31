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
    <form
      action={formAction}
      className="mt-6 max-w-lg space-y-4 rounded-2xl border border-brand-purple/10 bg-white p-6 shadow-card"
    >
      {forum && <input type="hidden" name="id" value={forum.id} />}

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Názov fóra
        </span>
        <input
          name="title"
          required
          defaultValue={forum?.title}
          className="w-full rounded-xl border border-brand-purple/20 px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Popis
        </span>
        <textarea
          name="description"
          rows={3}
          defaultValue={forum?.description ?? ""}
          className="w-full rounded-xl border border-brand-purple/20 px-3 py-2 text-sm"
        />
      </label>

      <AdminImageField
        name="imageUrl"
        label="Profilová fotka fóra"
        hint="Zobrazí sa v zozname fór v aplikácii. Ak prázdne, použije sa farba nižšie."
        defaultValue={forum?.imageUrl ?? ""}
        shape="circle"
      />

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Farba zálohy (hex)
        </span>
        <p className="mb-2 text-[11px] text-brand-purple/55">
          Použije sa, keď nie je nastavená profilová fotka.
        </p>
        <input
          name="accentColor"
          defaultValue={forum?.accentColor ?? "#6F2380"}
          className="w-full rounded-xl border border-brand-purple/20 px-3 py-2 text-sm"
        />
      </label>

      <div>
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Pre typ rakoviny
        </span>
        <CancerTypeSelect
          variant="admin"
          defaultValue={forum?.cancerTypes ?? []}
          helpText="Prázdne = fórum pre všetkých. Inak sa zobrazí najmä týmto používateľom."
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={forum?.published ?? true}
        />
        Publikované (viditeľné v aplikácii)
      </label>

      <FormError message={state.message} />

      <SubmitButton
        className="rounded-pill bg-brand-purple px-5 py-2 text-sm font-semibold text-white"
        pendingLabel="Ukladám…"
      >
        {mode === "create" ? "Vytvoriť fórum" : "Uložiť"}
      </SubmitButton>
    </form>
  );
}
