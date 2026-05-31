"use client";

import { useActionState } from "react";
import type { Post } from "@prisma/client";
import {
  createPostAction,
  updatePostAction,
  type ActionState,
} from "@/lib/actions/posts";
import { CancerTypeSelect } from "@/components/CancerTypeSelect";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function PostForm({
  mode,
  post,
  profileId,
}: {
  mode: "create" | "edit";
  post?: Post;
  profileId?: string;
}) {
  const [state, formAction] = useActionState(
    mode === "create" ? createPostAction : updatePostAction,
    INITIAL,
  );

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4 rounded-2xl border border-brand-purple/10 bg-white p-6 shadow-card"
    >
      {post && <input type="hidden" name="id" value={post.id} />}
      {(profileId || post?.profileId) && (
        <input
          type="hidden"
          name="profileId"
          value={profileId ?? post?.profileId ?? ""}
        />
      )}

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Typ
        </span>
        <select
          name="type"
          defaultValue={post?.type ?? "ARTICLE"}
          className="w-full rounded-xl border border-brand-purple/20 bg-white px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
        >
          <option value="VIDEO">Video</option>
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
      <Field
        label="Cover (URL obrázka)"
        name="coverUrl"
        defaultValue={post?.coverUrl ?? ""}
      />
      <Field
        label="Video (URL, len ak typ = Video)"
        name="videoUrl"
        defaultValue={post?.videoUrl ?? ""}
      />

      <div>
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Pre typ rakoviny
        </span>
        <CancerTypeSelect
          variant="admin"
          defaultValue={post?.cancerTypes ?? []}
          helpText="Prázdne = pre všetkých. Inak sa zobrazí najmä týmto používateľom."
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? true}
        />
        Publikované (viditeľné v aplikácii)
      </label>

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
      <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={5}
          className="w-full rounded-xl border border-brand-purple/20 bg-white px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          className="w-full rounded-xl border border-brand-purple/20 bg-white px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
        />
      )}
    </label>
  );
}
