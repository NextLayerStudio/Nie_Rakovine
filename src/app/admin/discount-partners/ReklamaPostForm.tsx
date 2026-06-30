"use client";

import { useActionState } from "react";
import {
  createReklamaPostAction,
  updateReklamaPostAction,
  type ActionState,
} from "@/lib/actions/admin-discount-partners";
import { AdminImageField } from "@/components/AdminImageField";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export type ReklamaPostInput = {
  id: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  linkedOfferId: string | null;
  published: boolean;
};

export type OfferOption = {
  id: string;
  label: string;
};

export function ReklamaPostForm({
  mode,
  partnerId,
  offers,
  post,
}: {
  mode: "create" | "edit";
  partnerId: string;
  offers: OfferOption[];
  post?: ReklamaPostInput;
}) {
  const [state, formAction] = useActionState(
    mode === "create" ? createReklamaPostAction : updateReklamaPostAction,
    INITIAL,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="partnerId" value={partnerId} />
      {post && <input type="hidden" name="id" value={post.id} />}

      <fieldset className="admin-fieldset">
        <legend>Reklama (príspevok v kanáli)</legend>
        <p className="mb-4 text-xs text-brand-purple/60">
          Reklama sa zobrazí v domovskom kanáli. Po kliknutí presmeruje
          používateľa na vybranú zľavovú kartu.
        </p>

        <AdminImageField
          name="coverUrl"
          uploadName="coverFile"
          label="Obrázok reklamy"
          defaultValue={post?.coverUrl ?? ""}
          shape="rounded"
          previewAspect="video"
        />

        <label className="block">
          <span className="admin-label">Nadpis (voliteľné)</span>
          <input
            name="title"
            type="text"
            defaultValue={post?.title ?? ""}
            className="admin-input"
          />
        </label>

        <label className="block">
          <span className="admin-label">Text (voliteľné)</span>
          <textarea
            name="excerpt"
            rows={3}
            defaultValue={post?.excerpt ?? ""}
            className="admin-input"
          />
        </label>

        <label className="block">
          <span className="admin-label">Prepojiť so zľavovou kartou</span>
          <select
            name="linkedOfferId"
            defaultValue={post?.linkedOfferId ?? ""}
            className="admin-input"
          >
            <option value="">— Žiadna (otvorí profil značky) —</option>
            {offers.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          {offers.length === 0 && (
            <span className="mt-1 block text-xs text-amber-600">
              Najprv pridajte aspoň jednu zľavovú kartu.
            </span>
          )}
        </label>
      </fieldset>

      <label className="flex items-center gap-3 rounded-lg bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? true}
          className="h-4 w-4 accent-brand-purple"
        />
        Publikovať v kanáli
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton className="admin-btn-primary" pendingLabel="Ukladám…">
          {mode === "create" ? "Vytvoriť reklamu" : "Uložiť zmeny"}
        </SubmitButton>
        <FormError message={state.ok ? undefined : state.message} />
      </div>
    </form>
  );
}
