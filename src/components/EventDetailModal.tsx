"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EventRegistrationForm } from "@/app/home/events/[id]/EventRegistrationForm";

export type EventModalData = {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  coverUrl: string | null;
  isRegistered: boolean;
  registrationCount: number;
  capacity: number | null;
  defaultName: string;
  defaultSurname: string;
};

export function EventDetailModal({
  event,
  onClose,
  onRegistered,
}: {
  event: EventModalData;
  onClose: () => void;
  onRegistered?: () => void;
}) {
  const [registered, setRegistered] = useState(event.isRegistered);
  const [registrationCount, setRegistrationCount] = useState(
    event.registrationCount,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRegistered(event.isRegistered);
    setRegistrationCount(event.registrationCount);
  }, [event.isRegistered, event.registrationCount]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const scrollEl = document.querySelector<HTMLElement>("[data-app-scroll]");
    const prev = scrollEl?.style.overflow ?? "";
    if (scrollEl) scrollEl.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      if (scrollEl) scrollEl.style.overflow = prev;
    };
  }, [onClose]);

  const startsAt = new Date(event.startsAt);
  const endsAt = event.endsAt ? new Date(event.endsAt) : null;

  const timeLabel = formatTimeRange(startsAt, endsAt);
  const dateLabel = formatDate(startsAt);
  const weekdayLabel = formatWeekday(startsAt);
  const isFull =
    event.capacity !== null &&
    registrationCount >= event.capacity &&
    !registered;

  const cover = event.coverUrl
    ? {
        backgroundImage: `url(${event.coverUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : {
        background:
          "linear-gradient(180deg, #f3c3a2 0%, #d98c80 60%, #6F2380 100%)",
      };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Zavrieť"
        onClick={onClose}
      />

      <div className="relative flex max-h-[min(90dvh,720px)] w-full max-w-[380px] flex-col overflow-hidden rounded-[28px] bg-brand-pink text-white shadow-card">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center text-white/90 transition hover:text-white"
          aria-label="Zavrieť"
        >
          <CloseIcon />
        </button>

        <div className="no-scrollbar overflow-y-auto px-5 pb-5 pt-8">
          <h2
            id="event-modal-title"
            className="text-center text-xl font-extrabold uppercase tracking-wide"
          >
            {event.title}
          </h2>

          <div
            className="mx-auto mt-5 aspect-square w-full max-w-[280px] rounded-2xl bg-cover bg-center"
            style={cover}
          />

          {registered ? (
            <p className="mx-auto mt-5 max-w-[280px] rounded-pill bg-white/15 py-2.5 text-center text-sm font-semibold text-white">
              Ste prihlásení na toto podujatie
            </p>
          ) : isFull ? (
            <p className="mx-auto mt-5 max-w-[280px] rounded-pill bg-white/15 py-2.5 text-center text-sm font-semibold text-white">
              Podujatie je plne obsadené
            </p>
          ) : (
            <EventRegistrationForm
              eventId={event.id}
              defaultName={event.defaultName}
              defaultSurname={event.defaultSurname}
              variant="modal"
              stayOnPage
              onSuccess={() => {
                setRegistered(true);
                setRegistrationCount((c) => c + 1);
                onRegistered?.();
              }}
            />
          )}

          <ul className="mt-6 space-y-4 text-sm leading-snug">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex-none text-white/90">
                <UsersIcon />
              </span>
              <span>{formatRegistrationCount(registrationCount, event.capacity)}</span>
            </li>
            {event.location && (
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-none text-white/90">
                  <PinIcon />
                </span>
                <span className="underline decoration-white/40 underline-offset-2">
                  {event.location}
                </span>
              </li>
            )}
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex-none text-white/90">
                <ClockIcon />
              </span>
              <span>{timeLabel}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex-none text-white/90">
                <CalendarIcon />
              </span>
              <span>
                {dateLabel}
                <br />
                {weekdayLabel}
              </span>
            </li>
            {event.description && (
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-none text-white/90">
                  <InfoIcon />
                </span>
                <span className="text-sm leading-relaxed text-white/95">
                  {event.description}
                </span>
              </li>
            )}
          </ul>

          <div className="mt-6 flex justify-center text-white/80">
            <ChevronDownIcon />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function formatTimeRange(start: Date, end: Date | null) {
  const time = new Intl.DateTimeFormat("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (end) return `${time.format(start)} - ${time.format(end)}`;
  return time.format(start);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("sk-SK", { weekday: "long" }).format(date);
}

function formatRegistrationCount(count: number, capacity: number | null) {
  if (capacity !== null) {
    return `${count} / ${capacity} prihlásených`;
  }
  return `${count} prihlásených`;
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M16 11a3 3 0 100-6 3 3 0 000 6zM8 12a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 20a5 5 0 0110 0M11 20a5 5 0 0110 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 10v6M12 7h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
