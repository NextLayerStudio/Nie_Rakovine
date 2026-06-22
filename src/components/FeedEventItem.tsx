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
  defaultName: string;
  defaultSurname: string;
}) {
  const [open, setOpen] = useState(false);

  const cover = coverUrl
    ? {
        backgroundImage: `url(${coverUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : { background: "linear-gradient(180deg, #f3c3a2 0%, #d98c80 100%)" };

  const date = new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
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
    registrationCount: 0,
    capacity: null,
    defaultName,
    defaultSurname,
  };

  return (
    <>
      <article className="border-b border-brand-purple/10">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block w-full text-left"
        >
          <div
            className="aspect-[4/3] max-h-[220px] w-full bg-cover bg-center"
            style={cover}
          />
          <span className="absolute right-4 top-4 rounded-pill bg-white/90 px-3 py-1 text-[10px] font-medium text-brand-purple/70">
            {date}
          </span>
        </button>

        <div className="flex items-center justify-end px-4 py-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-pill bg-brand-purple px-4 py-1.5 text-xs font-semibold text-white"
          >
            Zaregistrovať sa
          </button>
        </div>

        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full text-left"
          >
            <h3 className="text-base font-bold text-brand-purple">{title}</h3>
            {description && (
              <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-brand-purple/70">
                {description}
              </p>
            )}
            {location && (
              <p className="mt-1 text-xs text-brand-purple/55">
                {location}
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
