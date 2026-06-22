"use client";

import { useMemo, useState } from "react";
import {
  EventDetailModal,
  type EventModalData,
} from "@/components/EventDetailModal";

const WEEKDAYS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
const MONTHS = [
  "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
  "Júl", "August", "September", "Október", "November", "December",
];

export type ProfileRegisteredEvent = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  registrationCount: number;
  capacity: number | null;
};

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function sameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b);
}

export function ProfileCalendarTab({
  events,
  defaultName,
  defaultSurname,
}: {
  events: ProfileRegisteredEvent[];
  defaultName: string;
  defaultSurname: string;
}) {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [detail, setDetail] = useState<EventModalData | null>(null);

  /* days that have at least one registered event this month */
  const eventsByDay = useMemo(() => {
    const map = new Map<string, ProfileRegisteredEvent[]>();
    for (const e of events) {
      const d = new Date(e.startsAt);
      if (
        d.getFullYear() === viewMonth.getFullYear() &&
        d.getMonth() === viewMonth.getMonth()
      ) {
        const k = dayKey(d);
        map.set(k, [...(map.get(k) ?? []), e]);
      }
    }
    return map;
  }, [events, viewMonth]);

  const monthEvents = useMemo(
    () =>
      events.filter((e) => {
        const d = new Date(e.startsAt);
        return (
          d.getFullYear() === viewMonth.getFullYear() &&
          d.getMonth() === viewMonth.getMonth()
        );
      }),
    [events, viewMonth],
  );

  const grid = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  }, [viewMonth]);

  function openEvent(event: ProfileRegisteredEvent) {
    setDetail({
      id: event.id,
      title: event.title,
      description: event.description,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      location: event.location,
      coverUrl: event.coverUrl,
      isRegistered: true,
      registrationCount: event.registrationCount,
      capacity: event.capacity,
      defaultName,
      defaultSurname,
    });
  }

  function handleDayClick(date: Date) {
    const k = dayKey(date);
    const dayEvents = eventsByDay.get(k);
    if (dayEvents?.length) openEvent(dayEvents[0]);
  }

  const gallery = events.filter((e) => e.coverUrl).slice(0, 12);

  return (
    <div className="pb-6 pt-3">
      {/* Calendar card — full width, no side padding */}
      <div className="mx-4 overflow-hidden rounded-3xl bg-white shadow-card">

        {/* Month navigation */}
        <div className="flex items-center justify-between px-5 pb-2 pt-5">
          <button
            type="button"
            aria-label="Predchádzajúci mesiac"
            onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            className="grid h-10 w-10 place-items-center rounded-full text-2xl text-brand-purple/60 transition hover:bg-brand-purple/8"
          >
            ‹
          </button>
          <p className="text-base font-bold text-brand-purple">
            {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </p>
          <button
            type="button"
            aria-label="Ďalší mesiac"
            onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            className="grid h-10 w-10 place-items-center rounded-full text-2xl text-brand-purple/60 transition hover:bg-brand-purple/8"
          >
            ›
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 px-3 pb-1">
          {WEEKDAYS.map((d) => (
            <span
              key={d}
              className="text-center text-xs font-semibold uppercase tracking-wide text-brand-purple/40"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1 px-3 pb-5">
          {grid.map((date, i) => {
            if (!date) return <span key={`empty-${i}`} />;
            const k = dayKey(date);
            const hasEvent = eventsByDay.has(k);
            const isToday = sameDay(date, now);
            return (
              <button
                key={k}
                type="button"
                onClick={() => handleDayClick(date)}
                disabled={!hasEvent}
                className={`aspect-square w-full rounded-xl text-sm font-bold transition active:scale-95 ${
                  hasEvent
                    ? "bg-brand-pink text-white shadow-sm"
                    : isToday
                      ? "ring-2 ring-brand-pink/50 text-brand-purple"
                      : "text-brand-purple/70"
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Events list for this month */}
        {monthEvents.length > 0 && (
          <ul className="border-t border-brand-purple/8 px-4 pb-4 pt-3 space-y-1">
            {monthEvents.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => openEvent(e)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-brand-purple/5"
                >
                  <span className="shrink-0 rounded-lg bg-brand-pink/10 px-2 py-1 text-xs font-bold text-brand-pink">
                    {new Date(e.startsAt).toLocaleDateString("sk-SK", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-brand-purple">
                    {e.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Photo gallery */}
      {gallery.length > 0 && (
        <div className="mx-4 mt-4 grid grid-cols-3 gap-1.5">
          {gallery.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => openEvent(e)}
              className="aspect-square overflow-hidden rounded-xl bg-brand-purple/10"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${e.coverUrl})` }}
                aria-hidden
              />
            </button>
          ))}
        </div>
      )}

      {events.length === 0 && (
        <p className="mt-6 px-4 text-center text-sm text-brand-purple/50">
          Zatiaľ nemáte prihlásené žiadne aktivity.
        </p>
      )}

      {detail && (
        <EventDetailModal event={detail} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}
