"use client";

import Link from "next/link";
import { useState } from "react";
import type { EventCategory, EventRegion } from "@prisma/client";
import { EVENT_CATEGORY_META } from "@/lib/event-category";
import { regionLabel } from "@/lib/event-region";
import { formatEventDate, formatRegistrationCount, formatTimeRange } from "@/lib/event-format";
import { EventTicketModal } from "@/components/landing/EventTicketModal";

export type PublicEvent = {
  id: string;
  title: string;
  description: string | null;
  category: EventCategory | null;
  coverUrl: string | null;
  location: string | null;
  region: EventRegion | null;
  startsAt: string;
  endsAt: string | null;
  capacity: number | null;
  visibility: "PUBLIC" | "MEMBERS_ONLY";
  registrationCount: number;
};

export function EventCard({ event }: { event: PublicEvent }) {
  const [modalOpen, setModalOpen] = useState(false);
  const startsAt = new Date(event.startsAt);
  const endsAt = event.endsAt ? new Date(event.endsAt) : null;
  const isFull =
    event.capacity !== null && event.registrationCount >= event.capacity;
  const isMembersOnly = event.visibility === "MEMBERS_ONLY";

  return (
    <>
      <article
        className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#6F2380]/10 transition hover:shadow-md ${
          isMembersOnly ? "grayscale opacity-70" : ""
        }`}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#6F2380]/10">
          {event.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.coverUrl}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#FDA4C7] to-[#6F2380]" />
          )}
          {event.category && (
            <span
              className="absolute left-3 top-3 rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
              style={{
                background: EVENT_CATEGORY_META[event.category].color,
                color: EVENT_CATEGORY_META[event.category].text,
              }}
            >
              {EVENT_CATEGORY_META[event.category].label}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#FDA4C7]">
            {formatEventDate(startsAt)} · {formatTimeRange(startsAt, endsAt)}
          </p>
          <h3 className="text-base font-bold leading-snug text-[#6F2380]">
            {event.title}
          </h3>
          {event.description && (
            <p className="line-clamp-2 text-sm text-[#6F2380]/65">
              {event.description}
            </p>
          )}
          {(event.location || event.region) && (
            <p className="text-xs text-[#6F2380]/55">
              {[event.location, regionLabel(event.region)].filter(Boolean).join(" · ")}
            </p>
          )}

          <div className="mt-auto flex flex-col gap-3 pt-3">
            <p className="text-xs font-semibold text-[#6F2380]/60">
              {formatRegistrationCount(event.registrationCount, event.capacity)}
            </p>

            {isMembersOnly ? (
              <div className="rounded-xl bg-[#6F2380]/8 px-3 py-2.5 text-center">
                <p className="text-xs font-bold text-[#6F2380]">
                  🔒 Prístupné len pre členov ONKO KLUBU
                </p>
                <Link
                  href="/register"
                  className="mt-2 inline-block rounded-full bg-[#6F2380] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Staň sa členom
                </Link>
              </div>
            ) : isFull ? (
              <span className="rounded-full bg-[#6F2380]/10 px-4 py-2 text-center text-xs font-bold text-[#6F2380]/60">
                Kapacita naplnená
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-[#FDA4C7] px-4 py-2 text-xs font-bold text-white transition hover:brightness-105"
              >
                Registrovať sa
              </button>
            )}
          </div>
        </div>
      </article>

      {modalOpen && (
        <EventTicketModal
          eventId={event.id}
          eventTitle={event.title}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
