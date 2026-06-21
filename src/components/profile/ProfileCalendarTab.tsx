"use client";

import { useMemo, useState } from "react";
import {
  EventDetailModal,
  type EventModalData,
} from "@/components/EventDetailModal";

const WEEKDAYS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Máj", "Jún",
  "Júl", "Aug", "Sep", "Okt", "Nov", "Dec",
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

  const eventDays = useMemo(() => {
    const set = new Set<string>();
    for (const e of events) {
      const d = new Date(e.startsAt);
      if (
        d.getFullYear() === viewMonth.getFullYear() &&
        d.getMonth() === viewMonth.getMonth()
      ) {
        set.add(dayKey(d));
      }
    }
    return set;
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

  function prevMonth() {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  function nextMonth() {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

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

  const gallery = events.filter((e) => e.coverUrl).slice(0, 12);

  return (
    <div className="px-4 pb-6 pt-3">
      <div className="rounded-3xl bg-white p-4 shadow-card">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Predchádzajúci mesiac"
            onClick={prevMonth}
            className="grid h-8 w-8 place-items-center rounded-full text-brand-purple/70"
          >
            ‹
          </button>
          <p className="text-sm font-bold text-brand-purple">
            {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </p>
          <button
            type="button"
            aria-label="Ďalší mesiac"
            onClick={nextMonth}
            className="grid h-8 w-8 place-items-center rounded-full text-brand-purple/70"
          >
            ›
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAYS.map((d) => (
            <span
              key={d}
              className="text-[10px] font-semibold uppercase text-brand-purple/45"
            >
              {d}
            </span>
          ))}
          {grid.map((date, i) => {
            if (!date) {
              return <span key={`empty-${i}`} />;
            }
            const hasEvent = eventDays.has(dayKey(date));
            const isToday = sameDay(date, now);
            return (
              <div key={dayKey(date)} className="flex justify-center py-0.5">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${
                    hasEvent
                      ? "bg-brand-pink text-white"
                      : isToday
                        ? "text-brand-purple ring-1 ring-brand-pink/40"
                        : "text-brand-purple/80"
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {monthEvents.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-brand-purple/8 pt-3">
            {monthEvents.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => openEvent(e)}
                  className="flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-left transition hover:bg-brand-purple/5"
                >
                  <span className="text-xs font-bold text-brand-pink">
                    {new Date(e.startsAt).toLocaleDateString("sk-SK", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-brand-purple">
                    {e.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {gallery.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-1.5">
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
        <p className="mt-4 text-center text-xs text-brand-purple/55">
          Zatiaľ nemáte prihlásené žiadne aktivity.
        </p>
      )}

      {detail && (
        <EventDetailModal event={detail} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}
