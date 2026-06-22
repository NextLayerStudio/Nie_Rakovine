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
import { PROFILE_CATEGORY_LABELS } from "@/lib/profile-category";

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
    <form action={formAction} className="max-w-2xl space-y-6">
      {profile && <input type="hidden" name="id" value={profile.id} />}

      <fieldset className="admin-fieldset">
        <legend>Základné údaje</legend>
        <Field
          label="Zobrazované meno"
          name="displayName"
          defaultValue={profile?.displayName}
          required
        />
        <Field
          label="Identifikátor (URL)"
          name="handle"
          defaultValue={profile?.handle}
          placeholder="onko-yoga"
          required
        />
        <Field
          label="Bio"
          name="bio"
          defaultValue={profile?.bio ?? ""}
          textarea
        />

        <div>
          <span className="admin-label">Kategória profilu</span>
          <select
            name="category"
            defaultValue={profile?.category ?? ""}
            className="admin-input"
          >
            <option value="">— Bez kategórie —</option>
            {Object.entries(PROFILE_CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-brand-purple/50">
            Kategória určuje, v ktorom filtri sa profil zobrazí vo vyhľadávaní.
          </p>
        </div>

        <div>
          <span className="admin-label">Pre typ rakoviny</span>
          <CancerTypeSelect
            variant="admin"
            defaultValue={profile?.cancerTypes ?? []}
            helpText="Nechajte prázdne = profil pre všetkých. Inak sa zobrazí najmä používateľom s vybraným typom."
          />
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Obrázky</legend>
        <AdminImageField
          name="avatarUrl"
          uploadName="avatarFile"
          label="Profilová fotka"
          hint="Nahrajte z počítača alebo vložte odkaz."
          defaultValue={profile?.avatarUrl ?? ""}
          shape="circle"
        />
        <AdminImageField
          name="coverUrl"
          uploadName="coverFile"
          label="Titulná fotka profilu"
          hint="Širší banner v hornej časti profilu. Nahrajte z počítača alebo vložte odkaz."
          defaultValue={profile?.coverUrl ?? ""}
          shape="rounded"
        />
      </fieldset>

      <label className="flex items-center gap-3 rounded-2xl bg-brand-purple/5 px-4 py-3 text-sm font-medium text-brand-purple">
        <input
          type="checkbox"
          name="published"
          defaultChecked={profile?.published ?? true}
          className="h-4 w-4 accent-brand-purple"
        />
        Publikovaný profil (viditeľný v aplikácii)
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton className="admin-btn-primary" pendingLabel="Ukladám…">
          Uložiť
        </SubmitButton>
        <FormError message={state.ok ? undefined : state.message} />
        {state.ok && state.message && (
          <p className="text-sm font-medium text-emerald-700">{state.message}</p>
        )}
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
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  textarea?: boolean;
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
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className="admin-input"
        />
      )}
    </label>
  );
}
