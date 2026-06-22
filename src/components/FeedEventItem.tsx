"use client";

import { useState } from "react";
import {
  EventDetailModal,
  type EventModalData,
} from "@/components/EventDetailModal";

export function FeedEventItem({
  id,
  title,
  description,
  startsAt,
  endsAt,
  location,
  coverUrl,
  isRegistered,
  registrationCount,
  defaultName,
  defaultSurname,
}: {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  coverUrl: string | null;
  isRegistered: boolean;
  registrationCount?: number;
  capacity?: number;
  defaultName: string;
  defaultSurname: string;
}) {
  const isFull = capacity !== undefined && registrationCount !== undefined && registrationCount >= capacity;
  const [open, setOpen] = useState(false);

  const cover = coverUrl
    ? {
        backgroundImage: `url(${coverUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : { background: "linear-gradient(180deg, #f3c3a2 0%, #d98c80 100%)" };

  const dateFormatted = new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
  }).format(new Date(startsAt));

  const timeFormatted = new Intl.DateTimeFormat("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startsAt));

  const modalEvent: EventModalData = {
    id,
    title,
    description,
    startsAt,
    endsAt,
    location,
    coverUrl,
    isRegistered,
    registrationCount: registrationCount ?? 0,
    capacity: null,
    defaultName,
    defaultSurname,
  };

  return (
    <>
      <article className="border-b border-brand-purple/10">
        {/* Obrázok s tlačidlom dole-vľavo */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block w-full text-left"
        >
          <div
            className="aspect-[4/3] max-h-[220px] w-full bg-cover bg-center"
            style={cover}
          />
          <span className="absolute bottom-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-md backdrop-blur-sm ${
                isRegistered
                  ? "bg-emerald-500 text-white"
                  : "bg-brand-purple text-white"
              }`}
            >
              {isRegistered && <CheckIcon />}
              {isRegistered ? "Prihlásený" : "Zaregistrovať sa"}
            </span>
          </span>
        </button>

        {/* Textový obsah */}
        <div className="px-4 pb-4 pt-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full text-left"
          >
            <h3 className="text-base font-bold text-brand-purple">{title}</h3>

            {/* Meta riadok s ikonkami */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1 text-xs text-brand-purple/55">
                <CalendarIcon />
                {dateFormatted}
              </span>
              <span className="flex items-center gap-1 text-xs text-brand-purple/55">
                <ClockIcon />
                {timeFormatted}
              </span>
              {location && (
                <span className="flex items-center gap-1 text-xs text-brand-purple/55">
                  <LocationIcon />
                  <span className="max-w-[140px] truncate">{location}</span>
                </span>
              )}
              {registrationCount !== undefined && (
                <span className={`flex items-center gap-1 text-xs font-medium ${isFull ? "text-red-500/70" : "text-brand-purple/55"}`}>
                  <PeopleIcon />
                  {capacity !== undefined
                    ? `${registrationCount}/${capacity}`
                    : registrationCount}
                </span>
              )}
            </div>

            {description && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-purple/70">
                {description}
              </p>
            )}
          </button>
        </div>
      </article>

      {open && (
        <EventDetailModal event={modalEvent} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path d="M8 1.5C5.79 1.5 4 3.29 4 5.5c0 3.25 4 9 4 9s4-5.75 4-9c0-2.21-1.79-3.5-4-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path d="M11 13c0-2.21-1.343-4-3-4S5 10.79 5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13.5 13c0-1.66-1.007-3-2.25-3M2.5 13c0-1.66 1.007-3 2.25-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="11.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" fill="none" aria-hidden>
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
