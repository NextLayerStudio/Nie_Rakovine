"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import { FormError, SubmitButton } from "@/components/FormError";
import { SettingSwitch } from "@/components/SettingSwitch";
import {
  changePasswordAction,
  updateAccountAction,
  updatePreferencesAction,
  type SettingsActionState,
} from "@/lib/actions/settings";
import { cn } from "@/lib/utils";

const INITIAL: SettingsActionState = { ok: false };

const SCROLL_TOP_INSET = 72;
const SCROLL_BOTTOM_INSET = 92;

function scrollToSettingsSection(id: string) {
  const el = document.getElementById(id);
  const scroller = document.querySelector(
    "[data-settings-scroll]",
  ) as HTMLElement | null;
  if (!el || !scroller) return;

  const scrollerRect = scroller.getBoundingClientRect();
  const elTopRelative =
    el.getBoundingClientRect().top - scrollerRect.top + scroller.scrollTop;
  const elBottomRelative = elTopRelative + el.offsetHeight;

  const visibleTop = scroller.scrollTop + SCROLL_TOP_INSET;
  const visibleBottom =
    scroller.scrollTop + scroller.clientHeight - SCROLL_BOTTOM_INSET;

  let target = scroller.scrollTop;
  if (elTopRelative < visibleTop) {
    target = elTopRelative - SCROLL_TOP_INSET;
  } else if (elBottomRelative > visibleBottom) {
    target = elBottomRelative - scroller.clientHeight + SCROLL_BOTTOM_INSET;
  }

  target = Math.max(
    0,
    Math.min(target, scroller.scrollHeight - scroller.clientHeight),
  );
  scroller.scrollTo({ top: target, behavior: "smooth" });
}

type NotificationPrefs = {
  notifyNewPosts: boolean;
  notifyForumApproved: boolean;
  notifyForumReactions: boolean;
  notifyEventsNearby: boolean;
};

export function SettingsForms({
  fullName,
  email,
  consentNewsletter,
  notifyRadiusKm,
  notificationPrefs,
  subscriptionActive,
}: {
  fullName: string;
  email: string;
  consentNewsletter: boolean;
  notifyRadiusKm: number;
  notificationPrefs: NotificationPrefs;
  subscriptionActive: boolean;
}) {
  const [accountState, accountAction] = useActionState(
    updateAccountAction,
    INITIAL,
  );
  const [passwordState, passwordAction] = useActionState(
    changePasswordAction,
    INITIAL,
  );
  const [prefsState, prefsAction] = useActionState(
    updatePreferencesAction,
    INITIAL,
  );
  const [radius, setRadius] = useState(notifyRadiusKm);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const enabledCount = [
    notificationPrefs.notifyNewPosts,
    notificationPrefs.notifyForumApproved,
    notificationPrefs.notifyForumReactions,
    notificationPrefs.notifyEventsNearby,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <nav
        aria-label="Rýchla navigácia v nastaveniach"
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {[
          { href: "#ucet", label: "Účet" },
          { href: "#notifikacie", label: "Notifikácie" },
          { href: "#predplatne", label: "Predplatné" },
          { href: "#pravne", label: "Právne" },
        ].map((item) => (
          <button
            key={item.href}
            type="button"
            onClick={() => scrollToSettingsSection(item.href.slice(1))}
            className="shrink-0 rounded-pill border border-brand-purple/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-purple/75 transition hover:border-brand-pink/30 hover:text-brand-purple"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <SectionCard
        id="ucet"
        step="1"
        icon={<UserIcon />}
        title="Účet"
        subtitle="Meno a prihlasovací e-mail"
      >
        <form action={accountAction} className="space-y-4">
          <Field label="E-mail">
            <div className="flex items-center gap-3 rounded-2xl bg-brand-purple/5 px-4 py-3">
              <MailIcon />
              <span className="min-w-0 truncate text-sm text-brand-purple/70">
                {email}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-brand-purple/45">
              E-mail nie je možné zmeniť v aplikácii.
            </p>
          </Field>
          <Field label="Meno a priezvisko">
            <input
              name="fullName"
              type="text"
              required
              defaultValue={fullName}
              className="input-light"
              autoComplete="name"
            />
          </Field>
          <Feedback state={accountState} />
          <SubmitButton className="btn-secondary w-full py-2.5 text-sm">
            Uložiť meno
          </SubmitButton>
        </form>

        <div className="mt-5 border-t border-brand-purple/8 pt-4">
          <button
            type="button"
            onClick={() => setPasswordOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-2xl bg-brand-purple/[0.03] px-4 py-3 text-left transition hover:bg-brand-purple/[0.06]"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-purple/10 text-brand-purple">
                <LockIcon />
              </span>
              <span>
                <span className="block text-sm font-semibold text-brand-purple">
                  Zmena hesla
                </span>
                <span className="text-[11px] text-brand-purple/55">
                  {passwordOpen ? "Skryť formulár" : "Kliknite pre zmenu hesla"}
                </span>
              </span>
            </span>
            <ChevronDown open={passwordOpen} />
          </button>

          {passwordOpen && (
            <form action={passwordAction} className="mt-4 space-y-4">
              <Field label="Súčasné heslo">
                <input
                  name="currentPassword"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="input-light"
                />
              </Field>
              <Field label="Nové heslo">
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Min. 6 znakov"
                  className="input-light"
                />
              </Field>
              <Field label="Potvrdiť nové heslo">
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="input-light"
                />
              </Field>
              <Feedback state={passwordState} />
              <SubmitButton className="btn-primary w-full py-2.5 text-sm">
                Zmeniť heslo
              </SubmitButton>
            </form>
          )}
        </div>
      </SectionCard>

      <SectionCard
        id="notifikacie"
        step="2"
        icon={<BellIcon />}
        title="Notifikácie"
        subtitle={`${enabledCount} z 4 typov oznámení v aplikácii je zapnutých`}
      >
        <form action={prefsAction} className="space-y-5">
          <div className="rounded-2xl bg-brand-purple/[0.03] p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-purple/45">
              V aplikácii
            </p>
            <div className="divide-y divide-brand-purple/8">
              <SettingSwitch
                name="notifyNewPosts"
                label="Nové príspevky"
                description="Keď profil, ktorý sledujete, zverejní nový obsah."
                defaultChecked={notificationPrefs.notifyNewPosts}
              />
              <SettingSwitch
                name="notifyForumApproved"
                label="Fórum — schválenie príspevku"
                description="Keď moderátor schváli váš nový príspevok vo fóre."
                defaultChecked={notificationPrefs.notifyForumApproved}
              />
              <SettingSwitch
                name="notifyForumReactions"
                label="Fórum — reakcie na správy"
                description="Keď niekto reaguje srdiečkom alebo napíše textovú reakciu na váš príspevok či správu v chate."
                defaultChecked={notificationPrefs.notifyForumReactions}
              />
              <SettingSwitch
                name="notifyEventsNearby"
                label="Aktivity v okolí"
                description="Keď sa vo vašom okolí objaví nová aktivita alebo podujatie."
                defaultChecked={notificationPrefs.notifyEventsNearby}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-brand-pink/5 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-purple/45">
              E-mail
            </p>
            <ConsentCheckbox
              name="consentNewsletter"
              defaultChecked={consentNewsletter}
            >
              Chcem dostávať newsletter a novinky ONKO KLUBU e-mailom.
            </ConsentCheckbox>
          </div>

          <div className="rounded-2xl border border-brand-purple/8 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-purple/45">
              Polomer pre aktivity
            </p>
            <div className="mb-3 flex items-end justify-between">
              <p className="max-w-[70%] text-xs text-brand-purple/60">
                Vzdialenosť od vášho miesta pre upozornenia na aktivity v okolí.
              </p>
              <span className="rounded-pill bg-brand-purple/10 px-3 py-1 text-xs font-bold text-brand-purple">
                {radius} km
              </span>
            </div>
            <input
              name="notifyRadiusKm"
              type="range"
              min={10}
              max={200}
              step={5}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="settings-range w-full"
            />
            <div className="mt-1 flex justify-between text-[10px] text-brand-purple/50">
              <span>10 km</span>
              <span>200 km</span>
            </div>
          </div>

          <Feedback state={prefsState} />
          <SubmitButton className="btn-secondary w-full py-2.5 text-sm">
            Uložiť notifikácie
          </SubmitButton>
        </form>
      </SectionCard>

      <SectionCard
        id="predplatne"
        step="3"
        icon={<CardIcon />}
        title="Predplatné"
        subtitle="Stav vášho členstva"
      >
        <div className="flex items-center justify-between rounded-2xl bg-brand-purple/5 px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-brand-purple">
              {subscriptionActive ? "Aktívne" : "Neaktívne"}
            </p>
            <p className="mt-0.5 text-xs text-brand-purple/60">
              {subscriptionActive
                ? "Máte prístup k prémiovému obsahu."
                : "Predplatné môžete aktivovať pri registrácii."}
            </p>
          </div>
          <span
            className={cn(
              "h-3 w-3 shrink-0 rounded-full",
              subscriptionActive ? "bg-emerald-500" : "bg-brand-purple/25",
            )}
            aria-hidden
          />
        </div>
      </SectionCard>

      <SectionCard
        id="pravne"
        step="4"
        icon={<DocIcon />}
        title="Právne informácie"
        subtitle="Dokumenty a zásady"
      >
        <Link
          href="/cookies?from=/menu/nastavenia"
          className="flex items-center gap-3 rounded-2xl px-1 py-2 transition hover:bg-brand-purple/5"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-purple/10 text-brand-purple">
            <DocIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-brand-purple">
              Zásady cookies
            </span>
            <span className="text-xs text-brand-purple/60">
              Ako používame cookies v aplikácii
            </span>
          </span>
          <ChevronRight />
        </Link>
      </SectionCard>

      <div aria-hidden className="h-6 shrink-0" />
    </div>
  );
}

function SectionCard({
  id,
  step,
  icon,
  title,
  subtitle,
  children,
}: {
  id?: string;
  step?: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-3xl bg-white shadow-card"
    >
      <div className="flex items-center gap-3 border-b border-brand-purple/8 px-4 py-3.5">
        {step && (
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-purple/10 text-[11px] font-bold text-brand-purple">
            {step}
          </span>
        )}
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-pink/15 text-brand-pink">
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-brand-purple">{title}</h2>
          {subtitle && (
            <p className="text-[11px] text-brand-purple/55">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-brand-purple/80">
        {label}
      </label>
      {children}
    </div>
  );
}

function Feedback({ state }: { state: SettingsActionState }) {
  if (!state.message) return null;
  return state.ok ? (
    <p className="rounded-2xl bg-emerald-50 px-4 py-2.5 text-center text-xs font-medium text-emerald-700">
      {state.message}
    </p>
  ) : (
    <FormError message={state.message} />
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-purple/30" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 text-brand-purple/40 transition-transform", open && "rotate-180")}
      fill="none"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5L6 16z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M8 4h8l4 4v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 4v4h4M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand-purple/40" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
