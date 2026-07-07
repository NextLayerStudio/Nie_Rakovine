"use client";

import { useMemo, useState } from "react";
import { EventCard, type PublicEvent } from "@/components/landing/EventCard";

const WEEKDAYS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
const MONTHS = [
  "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
  "Júl", "August", "September", "Október", "November", "December",
];
const CITIES = [
  "Bratislava", "Košice", "Žilina", "Nitra", "Banská Bystrica",
  "Prešov", "Trnava", "Trenčín", "Piešťany",
];

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function sameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b);
}

/** Monday-first month grid; leading blanks as null. */
function buildMonthGrid(month: Date): (Date | null)[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1);
  const lead = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d));
  return cells;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function PublicEventsExplorer({ events }: { events: PublicEvent[] }) {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [search, setSearch] = useState("");

  const baseFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => (e.location ?? "").toLowerCase().includes(q));
  }, [events, search]);

  const eventDays = useMemo(() => {
    const set = new Set<string>();
    for (const e of baseFiltered) {
      const d = new Date(e.startsAt);
      if (
        d.getFullYear() === viewMonth.getFullYear() &&
        d.getMonth() === viewMonth.getMonth()
      ) {
        set.add(dayKey(d));
      }
    }
    return set;
  }, [baseFiltered, viewMonth]);

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
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1));
    setSelectedDay(null);
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
      <div className="flex h-fit flex-col gap-5">
        {/* Location filter */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#6F2380]/10">
          <p className="text-sm font-black text-[#6F2380]">Poloha</p>
          <div className="relative mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hľadať mesto alebo región"
              className="w-full rounded-full border border-[#6F2380]/15 bg-[#FFF3F9] py-2.5 pl-4 pr-9 text-sm text-[#6F2380] placeholder-[#6F2380]/40 outline-none focus:border-[#FDA4C7]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Vymazať"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F2380]/40"
              >
                ✕
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CITIES.map((city) => {
              const active = search.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSearch(active ? "" : city)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    active
                      ? "bg-[#6F2380] text-white"
                      : "bg-[#6F2380]/8 text-[#6F2380]/70 hover:bg-[#6F2380]/15"
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Month calendar */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#6F2380]/10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Predchádzajúci mesiac"
              className="grid h-8 w-8 place-items-center rounded-full text-[#6F2380] hover:bg-[#FDA4C7]/10"
            >
              ‹
            </button>
            <span className="text-sm font-black text-[#6F2380]">
              {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Nasledujúci mesiac"
              className="grid h-8 w-8 place-items-center rounded-full text-[#6F2380] hover:bg-[#FDA4C7]/10"
            >
              ›
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-y-1.5 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="text-[11px] font-semibold text-[#6F2380]/45">
                {w}
              </span>
            ))}
            {grid.map((cell, i) => {
              if (!cell) return <span key={`x-${i}`} />;
              const hasEvent = eventDays.has(dayKey(cell));
              const isToday = sameDay(cell, now);
              const isSelected = selectedDay && sameDay(cell, selectedDay);
              return (
                <button
                  key={dayKey(cell)}
                  type="button"
                  onClick={() => setSelectedDay(isSelected ? null : cell)}
                  className="relative mx-auto grid h-9 w-9 place-items-center rounded-full text-sm transition"
                  style={
                    isSelected
                      ? { background: "#FDA4C7", color: "#fff" }
                      : isToday
                        ? { background: "rgba(111,35,128,0.1)", color: "#6F2380" }
                        : { color: "#4A1A56" }
                  }
                >
                  {cell.getDate()}
                  {hasEvent && !isSelected && (
                    <span className="absolute bottom-1 h-2 w-2 rounded-full bg-[#FDA4C7] shadow-[0_0_0_1px_rgba(255,255,255,0.9)]" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedDay && (
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="mt-3 w-full text-center text-[11px] font-semibold text-[#FDA4C7]"
            >
              Zrušiť výber dňa
            </button>
          )}
        </div>
      </div>

      {/* Event grid */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wide text-[#6F2380]/70">
          {selectedDay
            ? `Podujatia ${selectedDay.getDate()}. ${MONTHS[selectedDay.getMonth()]}`
            : "Nadchádzajúce podujatia"}
        </h2>

        {listEvents.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#6F2380]/20 p-10 text-center text-sm text-[#6F2380]/55">
            Žiadne podujatia pre tento výber.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {listEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
