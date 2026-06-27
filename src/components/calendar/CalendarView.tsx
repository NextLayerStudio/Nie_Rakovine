"use client";

import { useEffect, useMemo, useState } from "react";
import type { EventCategory } from "@prisma/client";
import {
  EventDetailModal,
  type EventModalData,
} from "@/components/EventDetailModal";
import { formatEventPrice } from "@/lib/event-payment";
import {
  EVENT_CATEGORIES,
  EVENT_CATEGORY_META,
  categoryLabel,
} from "@/lib/event-category";
import { formatDistance } from "@/lib/geo";

export type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  coverUrl: string | null;
  category: EventCategory | null;
  startsAt: string;
  endsAt: string | null;
  profileName: string;
  registered: boolean;
  registrationCount: number;
  capacity: number | null;
  distanceKm: number | null;
  isPaid: boolean;
  priceCents: number | null;
  currency: string;
  pendingPayment: boolean;
};

const WEEKDAYS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
const MONTHS = [
  "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
  "Júl", "August", "September", "Október", "November", "December",
];
// Quick-pick Slovak cities (matches the registration region idea).
const CITIES = [
  "Bratislava", "Košice", "Žilina", "Nitra", "Banská Bystrica",
  "Prešov", "Trnava", "Trenčín", "Piešťany",
];

type LocationMode = "near" | "all";

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function sameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b);
}

export function CalendarView({
  events,
  hasLocation,
  radiusKm,
  defaultName,
  defaultSurname,
}: {
  events: CalendarEvent[];
  hasLocation: boolean;
  radiusKm: number;
  defaultName: string;
  defaultSurname: string;
}) {
  const now = new Date();
  const [eventsState, setEventsState] = useState(events);
  const [viewMonth, setViewMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [locationMode, setLocationMode] = useState<LocationMode>(
    hasLocation ? "near" : "all",
  );
  const [search, setSearch] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [detail, setDetail] = useState<EventModalData | null>(null);

  useEffect(() => {
    setEventsState(events);
  }, [events]);

  function openEventDetail(event: CalendarEvent) {
    setDetail({
      id: event.id,
      title: event.title,
      description: event.description,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      location: event.location,
      coverUrl: event.coverUrl,
      isRegistered: event.registered,
      registrationCount: event.registrationCount,
      capacity: event.capacity,
      defaultName,
      defaultSurname,
      isPaid: event.isPaid,
      priceCents: event.priceCents,
      currency: event.currency,
      pendingPayment: event.pendingPayment,
    });
  }

  function handleRegistered(eventId: string) {
    setEventsState((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              registered: true,
              registrationCount: e.registrationCount + 1,
            }
          : e,
      ),
    );
    setDetail((prev) =>
      prev && prev.id === eventId
        ? {
            ...prev,
            isRegistered: true,
            registrationCount: prev.registrationCount + 1,
          }
        : prev,
    );
  }

  // Apply location, search and category filters (but not the selected day).
  const baseFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return eventsState.filter((e) => {
      if (category && e.category !== category) return false;

      if (q) {
        const hay = `${e.title} ${e.location ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      } else if (locationMode === "near" && hasLocation) {
        // Near me = within radius OR already registered.
        const near = e.distanceKm !== null && e.distanceKm <= radiusKm;
        if (!near && !e.registered) return false;
      }
      return true;
    });
  }, [eventsState, category, search, locationMode, hasLocation, radiusKm]);

  // Days in the visible month that have events, flagged by registration.
  const eventDays = useMemo(() => {
    const map = new Map<string, { event: boolean; registered: boolean }>();
    for (const e of baseFiltered) {
      const d = new Date(e.startsAt);
      if (
        d.getFullYear() === viewMonth.getFullYear() &&
        d.getMonth() === viewMonth.getMonth()
      ) {
        const k = dayKey(d);
        const prev = map.get(k) ?? { event: false, registered: false };
        map.set(k, {
          event: prev.event || !e.registered,
          registered: prev.registered || e.registered,
        });
      }
    }
    return map;
  }, [baseFiltered, viewMonth]);

  // Event list: selected day, otherwise upcoming from today.
  const listEvents = useMemo(() => {
    const arr = selectedDay
      ? baseFiltered.filter((e) => sameDay(new Date(e.startsAt), selectedDay))
      : baseFiltered.filter((e) => new Date(e.startsAt) >= startOfToday());
    return [...arr].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
  }, [baseFiltered, selectedDay]);

  const grid = buildMonthGrid(viewMonth);

  function shiftMonth(delta: number) {
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1),
    );
    setSelectedDay(null);
  }

  return (
    <section className="px-4 pb-24">
      {/* Location selector */}
      <div className="rounded-3xl bg-white shadow-card">
        <button
          type="button"
          onClick={() => setLocationOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-brand-purple">
            <PinIcon />
            {locationMode === "near" && hasLocation && !search
              ? "Moja poloha"
              : search
                ? search
                : "Všetky aktivity"}
          </span>
          <Chevron open={locationOpen} />
        </button>

        {locationOpen && (
          <div className="border-t border-brand-purple/10 px-4 py-3">
            {hasLocation && (
              <button
                type="button"
                onClick={() => {
                  setLocationMode("near");
                  setSearch("");
                  setLocationOpen(false);
                }}
                className={`mb-2 flex w-full items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold ${
                  locationMode === "near" && !search
                    ? "bg-brand-purple text-white"
                    : "bg-brand-pink-soft/40 text-brand-purple"
                }`}
              >
                <PinIcon /> Aktivity v mojom okolí ({radiusKm} km)
              </button>
            )}

            <div className="relative">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setLocationMode("all");
                }}
                placeholder="Hľadať mesto alebo región"
                className="w-full rounded-full border-0 bg-brand-pink-soft/40 py-2.5 pl-4 pr-10 text-sm text-brand-purple placeholder-brand-purple/50 outline-none"
              />
              <SearchIcon />
            </div>

            <div className="mt-3 flex flex-col">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSearch(c);
                    setLocationMode("all");
                    setLocationOpen(false);
                  }}
                  className="border-b border-brand-purple/5 py-2 text-left text-sm text-brand-purple/80 last:border-0"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Month calendar */}
      <div className="mt-3 rounded-3xl bg-white p-4 shadow-card">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Predchádzajúci mesiac"
            className="grid h-8 w-8 place-items-center rounded-full text-brand-purple"
          >
            <ArrowIcon dir="left" />
          </button>
          <span className="text-sm font-bold text-brand-purple">
            {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Nasledujúci mesiac"
            className="grid h-8 w-8 place-items-center rounded-full text-brand-purple"
          >
            <ArrowIcon dir="right" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-[11px] font-medium text-brand-purple/50">
              {w}
            </span>
          ))}
          {grid.map((cell, i) => {
            if (!cell) return <span key={`x-${i}`} />;
            const flags = eventDays.get(dayKey(cell));
            const isToday = sameDay(cell, now);
            const isSelected = selectedDay && sameDay(cell, selectedDay);
            return (
              <button
                key={dayKey(cell)}
                type="button"
                onClick={() =>
                  setSelectedDay(isSelected ? null : cell)
                }
                className="relative mx-auto grid h-9 w-9 place-items-center rounded-full text-sm"
                style={
                  isSelected
                    ? { background: "#CA6A8A", color: "#fff" }
                    : isToday
                      ? { background: "rgba(111,35,128,0.10)", color: "#6F2380" }
                      : { color: "#3a2540" }
                }
              >
                {cell.getDate()}
                {flags && !isSelected && (
                  <span className="absolute bottom-1 flex items-center gap-0.5">
                    {flags.registered && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    )}
                    {flags.event && (
                      <span className="h-1 w-1 rounded-full bg-brand-pink" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-brand-purple/60">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Som prihlásený/á
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-brand-pink" />
            Aktivita
          </span>
        </div>

        {selectedDay && (
          <button
            type="button"
            onClick={() => setSelectedDay(null)}
            className="mt-2 w-full text-center text-[11px] font-semibold text-brand-pink"
          >
            Zrušiť výber dňa
          </button>
        )}
      </div>

      {/* Category tiles */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        {EVENT_CATEGORIES.map((c) => {
          const meta = EVENT_CATEGORY_META[c];
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(active ? null : c)}
              className={`rounded-2xl px-4 py-5 text-left text-sm font-bold shadow-card transition ${
                active ? "ring-2 ring-brand-purple ring-offset-2" : ""
              }`}
              style={{ background: meta.color, color: meta.text }}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {category && (
        <button
          type="button"
          onClick={() => setCategory(null)}
          className="mt-3 w-full text-center text-xs font-semibold text-brand-pink"
        >
          Zrušiť filter kategórie
        </button>
      )}

      {/* Event list */}
      <div className="mt-4 space-y-3">
        <h3 className="px-1 text-xs font-bold uppercase tracking-wide text-brand-purple/70">
          {selectedDay
            ? `Aktivity ${selectedDay.getDate()}. ${MONTHS[selectedDay.getMonth()]}`
            : "Pripravované aktivity"}
        </h3>

        {listEvents.length === 0 ? (
          <div className="card p-5 text-center text-xs text-brand-purple/70">
            Žiadne aktivity pre tento výber.
          </div>
        ) : (
          listEvents.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => openEventDetail(e)}
              className="block w-full rounded-3xl bg-white p-4 text-left shadow-card"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium uppercase text-brand-pink">
                  {formatEventDate(e.startsAt)}
                </p>
                {e.category && (
                  <span
                    className="rounded-pill px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: EVENT_CATEGORY_META[e.category].color,
                      color: EVENT_CATEGORY_META[e.category].text,
                    }}
                  >
                    {categoryLabel(e.category)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-bold text-brand-purple">
                {e.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-brand-purple/70">
                {e.location && <span>{e.location}</span>}
                {e.distanceKm !== null && (
                  <span className="font-semibold text-brand-pink">
                    {formatDistance(e.distanceKm)} od vás
                  </span>
                )}
                {e.registered && (
                  <span className="rounded-pill bg-brand-purple/10 px-2 py-0.5 font-semibold text-brand-purple">
                    Prihlásený/á
                  </span>
                )}
                {e.isPaid && e.priceCents ? (
                  <span className="rounded-pill bg-amber-100 px-2 py-0.5 font-semibold text-amber-900">
                    {formatEventPrice(e.priceCents, e.currency)}
                  </span>
                ) : null}
              </div>
            </button>
          ))
        )}
      </div>

      {detail && (
        <EventDetailModal
          event={detail}
          onClose={() => setDetail(null)}
          onRegistered={() => handleRegistered(detail.id)}
        />
      )}
    </section>
  );
}

/* ---------------- helpers ---------------- */

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Monday-first month grid; leading blanks as null. */
function buildMonthGrid(month: Date): (Date | null)[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1);
  const lead = (first.getDay() + 6) % 7; // 0 = Monday
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d));
  return cells;
}

function formatEventDate(iso: string): string {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/* ---------------- icons ---------------- */

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
      <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9.5A2.5 2.5 0 1012 6a2.5 2.5 0 000 5.5z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-purple/60"
      fill="none"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 text-brand-purple transition ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
