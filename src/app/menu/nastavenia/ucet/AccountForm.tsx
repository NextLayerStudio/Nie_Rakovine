"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/FormError";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import {
  requestPasswordChangeLinkAction,
  updateAccountAction,
  type SettingsActionState,
} from "@/lib/actions/settings";
import { ChevronDown, Feedback, Field } from "../settings-ui";

const INITIAL: SettingsActionState = { ok: false };

export function AccountForm({
  firstName,
  lastName,
  email,
}: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  const [accountState, accountAction] = useActionState(
    updateAccountAction,
    INITIAL,
  );
  const [passwordState, passwordAction] = useActionState(
    requestPasswordChangeLinkAction,
    INITIAL,
  );
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <div className="px-5 pt-4 pb-12">
      <form action={accountAction} className="space-y-4">
        <Field label="E-mail">
          <p className="text-sm text-brand-purple/70">{email}</p>
          <p className="mt-1 text-[11px] text-brand-purple/45">
            E-mail nie je možné zmeniť v aplikácii.
          </p>
        </Field>
        <div className="flex gap-3">
          <Field label="Meno" className="flex-1">
            <input
              name="firstName"
              type="text"
              required
              defaultValue={firstName}
              className="input-light"
              autoComplete="given-name"
            />
          </Field>
          <Field label="Priezvisko" className="flex-1">
            <input
              name="lastName"
              type="text"
              required
              defaultValue={lastName}
              className="input-light"
              autoComplete="family-name"
            />
          </Field>
        </div>
        <Feedback state={accountState} />
        <SubmitButton className="btn-secondary w-full py-2.5 text-sm">
          Uložiť meno
        </SubmitButton>
      </form>

      <div className="mt-6 border-t border-brand-purple/10 pt-5">
        <button
          type="button"
          onClick={() => setPasswordOpen((v) => !v)}
          className="flex w-full items-center justify-between py-1 text-left"
        >
          <span>
            <span className="block text-sm font-semibold text-brand-purple">
              Zmena hesla
            </span>
            <span className="text-xs text-brand-purple/55">
              {passwordOpen ? "Skryť" : "Poslať odkaz na e-mail"}
            </span>
          </span>
          <ChevronDown open={passwordOpen} />
        </button>

        {passwordOpen && (
          <form action={passwordAction} className="mt-4 space-y-4">
            <p className="text-xs leading-relaxed text-brand-purple/70">
              Z bezpečnostných dôvodov nemeníme heslo priamo v aplikácii.
              Pošleme vám na e-mail{" "}
              <span className="font-semibold text-brand-purple">
                jednorazový odkaz s platnosťou 30 minút
              </span>
              . Po kliknutí naň si nastavíte nové heslo.
            </p>
            <Feedback state={passwordState} />
            <SubmitButton
              className="btn-primary w-full py-2.5 text-sm"
              pendingLabel="Odosielam…"
            >
              Poslať odkaz na zmenu hesla
            </SubmitButton>
          </form>
        )}
      </div>

      <DeleteAccountSection email={email} />
    </div>
  );
}
