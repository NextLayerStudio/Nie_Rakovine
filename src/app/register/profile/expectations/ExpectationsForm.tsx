"use client";

import { useActionState, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  saveExpectationsAction,
  type ActionState,
} from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { CheckboxList } from "@/components/CheckboxList";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import { CookiesModal } from "@/components/CookiesModal";

const INITIAL: ActionState = { ok: false };
const DRAFT_KEY = "register-expectations-draft";

type ExpectationsDraft = {
  expectations: string[];
  help: string[];
  consentMembership: boolean;
  consentNewsletter: boolean;
};

function readDraft(): ExpectationsDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ExpectationsDraft;
  } catch {
    return null;
  }
}

function writeDraft(draft: ExpectationsDraft) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function clearDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}

export function ExpectationsForm({
  expectationsOptions,
  helpOptions,
  defaultExpectations,
  defaultHelp,
  defaultConsentMembership,
  defaultConsentNewsletter,
}: {
  expectationsOptions: string[];
  helpOptions: string[];
  defaultExpectations: string[];
  defaultHelp: string[];
  defaultConsentMembership: boolean;
  defaultConsentNewsletter: boolean;
}) {
  const [state, formAction] = useActionState(saveExpectationsAction, INITIAL);
  const [expectations, setExpectations] = useState(defaultExpectations);
  const [help, setHelp] = useState(defaultHelp);
  const [consentMembership, setConsentMembership] = useState(
    defaultConsentMembership,
  );
  const [consentNewsletter, setConsentNewsletter] = useState(
    defaultConsentNewsletter,
  );
  const [showCookies, setShowCookies] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setExpectations(draft.expectations);
      setHelp(draft.help);
      setConsentMembership(draft.consentMembership);
      setConsentNewsletter(draft.consentNewsletter);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeDraft({
      expectations,
      help,
      consentMembership,
      consentNewsletter,
    });
  }, [
    hydrated,
    expectations,
    help,
    consentMembership,
    consentNewsletter,
  ]);

  return (
    <form
      action={formAction}
      className="mt-8 flex flex-col items-center gap-5 px-5 pb-6"
      onSubmit={() => clearDraft()}
    >
      <h2 className="text-center text-xl font-bold leading-snug text-brand-purple">
        Čo očakávate od členstva v ONKO KLUBE?
      </h2>
      <CheckboxList
        name="expectations"
        options={expectationsOptions}
        selected={expectations}
        onSelectedChange={setExpectations}
        variant="plain"
      />

      <h3 className="text-center text-xl font-bold leading-snug text-brand-purple">
        Čo by vám v tejto chvíli najviac pomohlo?
      </h3>
      <CheckboxList
        name="help"
        options={helpOptions}
        selected={help}
        onSelectedChange={setHelp}
        variant="plain"
      />

      <div className="w-full space-y-1 border-t border-brand-purple/10 pt-4 [&_label_span:last-child]:text-base">
        <ConsentCheckbox
          name="consentMembership"
          required
          checked={consentMembership}
          onCheckedChange={setConsentMembership}
        >
          súhlas so spracovaním osobných údajov – členstvo
        </ConsentCheckbox>
        <ConsentCheckbox
          name="consentNewsletter"
          checked={consentNewsletter}
          onCheckedChange={setConsentNewsletter}
        >
          súhlas s posielaním newsletterov
        </ConsentCheckbox>
        <p className="pt-1 text-sm text-brand-purple/55">
          Viac o cookies:{" "}
          <button
            type="button"
            className="underline underline-offset-2"
            onClick={() => setShowCookies(true)}
          >
            Zásady cookies
          </button>
        </p>
      </div>

      {showCookies && <CookiesModal onClose={() => setShowCookies(false)} />}

      <FormError message={state.message} />

      <div className="flex w-full justify-center pt-6">
        <SubmitButton
          className="btn-secondary !grid w-[94%] grid-cols-[1fr_auto_1fr] items-center !px-4 !py-3.5 text-base font-medium"
          pendingLabel="Ukladám…"
        >
          <>
            <span aria-hidden />
            <span>Ďalej</span>
            <Chevron className="justify-self-end" />
          </>
        </SubmitButton>
      </div>
    </form>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 shrink-0", className)}
      fill="none"
      aria-hidden
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
