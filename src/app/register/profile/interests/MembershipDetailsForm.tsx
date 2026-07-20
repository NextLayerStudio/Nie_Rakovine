"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  saveMembershipDetailsAction,
  type ActionState,
} from "@/lib/actions/profile";
import { FormError, SubmitButton } from "@/components/FormError";
import { CheckboxList } from "@/components/CheckboxList";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import { CookiesModal } from "@/components/CookiesModal";
import { useFormRedirect } from "@/hooks/useFormRedirect";

const INITIAL: ActionState = { ok: false };
const DRAFT_KEY = "register-membership-details-draft";

type Draft = {
  interests: string[];
  expectations: string[];
  help: string[];
  hearAboutUs: string[];
  consentMembership: boolean;
  consentNewsletter: boolean;
};

function readDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Draft;
  } catch {
    return null;
  }
}

function writeDraft(draft: Draft) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function clearDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}

export function MembershipDetailsForm({
  interestsOptions,
  expectationsOptions,
  helpOptions,
  hearAboutUsOptions,
  defaultInterests,
  defaultExpectations,
  defaultHelp,
  defaultHearAboutUs,
  defaultConsentMembership,
  defaultConsentNewsletter,
}: {
  interestsOptions: string[];
  expectationsOptions: string[];
  helpOptions: string[];
  hearAboutUsOptions: string[];
  defaultInterests: string[];
  defaultExpectations: string[];
  defaultHelp: string[];
  defaultHearAboutUs: string[];
  defaultConsentMembership: boolean;
  defaultConsentNewsletter: boolean;
}) {
  const [state, formAction] = useActionState(
    saveMembershipDetailsAction,
    INITIAL,
  );
  const [interests, setInterests] = useState(defaultInterests);
  const [expectations, setExpectations] = useState(defaultExpectations);
  const [help, setHelp] = useState(defaultHelp);
  const [hearAboutUs, setHearAboutUs] = useState(defaultHearAboutUs);
  const [consentMembership, setConsentMembership] = useState(
    defaultConsentMembership,
  );
  const [consentNewsletter, setConsentNewsletter] = useState(
    defaultConsentNewsletter,
  );
  const [showCookies, setShowCookies] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useFormRedirect(state);

  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setInterests(draft.interests);
      setExpectations(draft.expectations);
      setHelp(draft.help);
      setHearAboutUs(draft.hearAboutUs);
      setConsentMembership(draft.consentMembership);
      setConsentNewsletter(draft.consentNewsletter);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeDraft({
      interests,
      expectations,
      help,
      hearAboutUs,
      consentMembership,
      consentNewsletter,
    });
  }, [
    hydrated,
    interests,
    expectations,
    help,
    hearAboutUs,
    consentMembership,
    consentNewsletter,
  ]);

  return (
    <form
      action={formAction}
      className="mt-6 flex flex-col items-center gap-6 px-5 pb-6"
      onSubmit={() => clearDraft()}
    >
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-center text-xl font-bold leading-snug text-brand-purple">
          O čo máte záujem?
        </h2>
        <CheckboxList
          name="interests"
          options={interestsOptions}
          selected={interests}
          onSelectedChange={setInterests}
          variant="plain"
        />
      </div>

      <div className="flex w-full flex-col items-center gap-4 border-t border-brand-purple/10 pt-6">
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
      </div>

      <div className="flex w-full flex-col items-center gap-4 border-t border-brand-purple/10 pt-6">
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
      </div>

      <div className="flex w-full flex-col items-center gap-4 border-t border-brand-purple/10 pt-6">
        <h3 className="text-center text-xl font-bold leading-snug text-brand-purple">
          Odkiaľ ste sa o nás dozvedeli?
        </h3>
        <CheckboxList
          name="hearAboutUs"
          options={hearAboutUsOptions}
          selected={hearAboutUs}
          onSelectedChange={setHearAboutUs}
          variant="plain"
        />
      </div>

      <div className="w-full space-y-1 border-t border-brand-purple/10 pt-4 [&_label_span:last-child]:text-base">
        <ConsentCheckbox
          name="consentMembership"
          required
          checked={consentMembership}
          onCheckedChange={setConsentMembership}
        >
          súhlas so spracovaním osobných údajov v súlade so{" "}
          <Link
            href="/ochrana-sukromia"
            target="_blank"
            className="font-semibold underline underline-offset-2"
          >
            Zásadami ochrany osobných údajov
          </Link>{" "}
          (členstvo)
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
            Zásady používania súborov cookies
          </button>
        </p>
      </div>

      {showCookies && <CookiesModal onClose={() => setShowCookies(false)} />}

      <FormError message={state.message} />

      <div className="flex w-full justify-center pt-2">
        <SubmitButton
          className="btn-secondary !grid w-[94%] grid-cols-[1fr_auto_1fr] items-center !px-4 !py-3.5 text-base font-medium"
          pendingLabel="Ukladám…"
        >
          <>
            <span aria-hidden />
            <span>Hotovo</span>
            <span aria-hidden />
          </>
        </SubmitButton>
      </div>
    </form>
  );
}
