"use client";

import { useActionState } from "react";
import type { Post, PostImage } from "@prisma/client";
import {
  createPostAction,
  updatePostAction,
  type ActionState,
} from "@/lib/actions/posts";
import { CancerTypeSelect } from "@/components/CancerTypeSelect";
import { AdminImageField } from "@/components/AdminImageField";
import { AdminMultiImageField } from "@/components/AdminMultiImageField";
import { AdminVideoField } from "@/components/AdminVideoField";
import { AdminAudioField } from "@/components/AdminAudioField";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

type PostWithImages = Post & { images?: PostImage[] };

export function PostForm({
  mode,
  post,
  profileId,
}: {
  mode: "create" | "edit";
  post?: PostWithImages;
  profileId?: string;
}) {
  const [state, formAction] = useActionState(
    mode === "create" ? createPostAction : updatePostAction,
    INITIAL,
  );

  return (
    <form action={formAction} className="space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}
      {(profileId || post?.profileId) && (
        <input
          type="hidden"
          name="profileId"
          value={profileId ?? post?.profileId ?? ""}
        />
      )}

      <fieldset className="admin-fieldset">
        <legend>Obsah</legend>
        <label className="block">
          <span className="admin-label">Typ</span>
          <select
            name="type"
            defaultValue={post?.type ?? "ARTICLE"}
            className="admin-input"
          >
            <option value="PHOTO">Fotka</option>
            <option value="VIDEO">Video</option>
            <option value="AUDIO">Audio</option>
            <option value="ARTICLE">Článok</option>
            <option value="RECIPE">Recept</option>
          </select>
        </label>

        <Field label="Názov" name="title" defaultValue={post?.title} />
        <Field
          label="Krátky výňatok"
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
        />
        <Field
          label="Obsah (markdown / text)"
          name="body"
          defaultValue={post?.body ?? ""}
          textarea
        />
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Médiá a cielenie</legend>
        <AdminImageField
          name="coverUrl"
          uploadName="coverFile"
          label="Titulný obrázok"
          hint="Hlavný náhľad v feede. Nahrajte z počítača alebo vložte odkaz."
          defaultValue={post?.coverUrl ?? ""}
          shape="rounded"
          previewAspect="video"
        />
        <AdminMultiImageField existingImages={post?.images ?? []} />
        <AdminVideoField defaultValue={post?.videoUrl ?? ""} />
        <AdminAudioField defaultValue={post?.audioUrl ?? ""} />
        <label className="block">
          <span className="admin-label">Dĺžka (minúty)</span>
          <input
            name="durationMin"
            type="number"
            min="0"
            defaultValue={post?.durationSec ? Math.round(post.durationSec / 60) : ""}
            className="admin-input"
          />
          <p className="mt-1 text-[11px] text-brand-purple/55">
            Voliteľné. Zobrazí sa pri audio a video obsahu (napr. „15 min“).
          </p>
        </label>
        <div>
          <span className="admin-label">Pre typ rakoviny</span>
          <CancerTypeSelect
            variant="admin"
            defaultValue={post?.cancerTypes ?? []}
            helpText="Prázdne = pre všetkých. Inak sa zobrazí najmä týmto používateľom."
          />
        </div>
      </fieldset>

      <label className="flex items-center gap-3 rounded-2xl bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
        <input
          type="checkbox"
          name="isNovinka"
          defaultChecked={post?.isNovinka ?? post?.type === "NEWS"}
          className="h-4 w-4 accent-brand-purple"
        />
        Novinka (zobrazí sa aj v Kontent knižnici – Novinky)
      </label>

      <label className="flex items-center gap-3 rounded-2xl bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? true}
          className="h-4 w-4 accent-brand-purple"
        />
        Publikované (viditeľné v aplikácii)
      </label>

      <FormError message={state.message} />

      <div className="flex justify-end gap-2">
        <SubmitButton className="admin-btn-primary" pendingLabel="Ukladám…">
          {mode === "create" ? "Vytvoriť" : "Uložiť zmeny"}
        </SubmitButton>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  textarea,
}: {
  label: string;
  name: string;
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
          rows={5}
          className="admin-input"
        />
      ) : (
        <input name={name} defaultValue={defaultValue} className="admin-input" />
      )}
    </label>
  );
}
