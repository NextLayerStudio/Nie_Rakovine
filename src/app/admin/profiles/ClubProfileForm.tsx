"use client";

import { useActionState } from "react";
import type { ClubProfile } from "@prisma/client";
import {
  createClubProfileAction,
  updateClubProfileAction,
  type ActionState,
} from "@/lib/actions/admin-profiles";
import { AdminImageField } from "@/components/AdminImageField";
import { CancerTypeSelect } from "@/components/CancerTypeSelect";
import { FormError, SubmitButton } from "@/components/FormError";

const INITIAL: ActionState = { ok: false };

export function ClubProfileForm({
  mode,
  profile,
}: {
  mode: "create" | "edit";
  profile?: ClubProfile;
}) {
  const [state, formAction] = useActionState(
    mode === "create" ? createClubProfileAction : updateClubProfileAction,
    INITIAL,
  );

  return (
    <form
      action={formAction}
      className="mt-6 max-w-lg space-y-4 rounded-2xl border border-brand-purple/10 bg-white p-6 shadow-card"
    >
      {profile && <input type="hidden" name="id" value={profile.id} />}

      <Field label="Zobrazované meno" name="displayName" defaultValue={profile?.displayName} required />
      <Field
        label="Identifikátor (URL)"
        name="handle"
        defaultValue={profile?.handle}
        placeholder="onko-yoga"
        required
      />
      <Field label="Bio" name="bio" defaultValue={profile?.bio ?? ""} textarea />

      <div>
        <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
          Pre typ rakoviny
        </span>
        <CancerTypeSelect
          variant="admin"
          defaultValue={profile?.cancerTypes ?? []}
          helpText="Nechajte prázdne = profil pre všetkých. Inak sa zobrazí najmä používateľom s vybraným typom."
        />
      </div>

      <AdminImageField
        name="avatarUrl"
        label="Profilová fotka"
        hint="Odkaz na obrázok (napr. z Cloudinary, Imgur alebo váš hosting)."
        defaultValue={profile?.avatarUrl ?? ""}
        shape="circle"
      />

      <AdminImageField
        name="coverUrl"
        label="Titulná fotka profilu"
        hint="Širší banner v hornej časti profilu v aplikácii."
        defaultValue={profile?.coverUrl ?? ""}
        shape="rounded"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={profile?.published ?? true}
        />
        Publikovaný profil
      </label>

      <FormError message={state.message} />
      {state.ok && state.message && (
        <p className="text-sm text-green-700">{state.message}</p>
      )}
      <SubmitButton className="rounded-pill bg-brand-purple px-6 py-2 text-sm font-semibold text-white">
        Uložiť
      </SubmitButton>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  textarea,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const className =
    "w-full rounded-xl border border-brand-purple/20 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none";
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          defaultValue={defaultValue}
          className={className}
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className={className}
        />
      )}
    </label>
  );
}
