"use client";

import { useMemo, useState } from "react";
import type { EventCategory, EventRegion } from "@prisma/client";
import { X } from "lucide-react";
import { EventCard, type PublicEvent } from "@/components/landing/EventCard";
import { EVENT_REGION_FILTER_OPTIONS } from "@/lib/event-region";
import { useEventsFilter } from "@/components/landing/EventsFilterContext";
import { CategoryFilterBar } from "@/components/landing/CategoryFilterBar";

const WEEKDAYS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
const MONTHS = [
  "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
  "Júl", "August", "September", "Október", "November", "December",
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

export function PublicEventsExplorer({
  events,
  category,
}: {
  events: PublicEvent[];
  category: EventCategory | "";
}) {
  const { filtersOpen, closeFilters } = useEventsFilter();
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [region, setRegion] = useState<EventRegion | "">("");

  const baseFiltered = useMemo(() => {
    if (!region) return events;
    return events.filter((e) => e.region === region);
  }, [events, region]);

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
    <>
      {/* Mobile filter backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          filtersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeFilters}
        aria-hidden
      />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        {/* Filters — slide-in drawer from the right on mobile (same animation
            as the main nav menu), static sidebar on desktop. */}
        <div
          className={`fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-xs flex-col gap-5 overflow-y-auto bg-[#FFF3F9] p-5 shadow-xl transition-transform duration-300 ease-in-out
          lg:static lg:z-auto lg:w-auto lg:max-w-none lg:flex-col lg:gap-5 lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none lg:transition-none lg:translate-x-0
          ${filtersOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center justify-between lg:hidden">
            <p className="text-base font-black text-[#6F2380]">Filtre</p>
            <button
              type="button"
              onClick={closeFilters}
              aria-label="Zatvoriť filtre"
              className="grid h-9 w-9 place-items-center rounded-full bg-[#6F2380]/10 text-[#6F2380]"
            >
              <X size={16} />
            </button>
          </div>

          <CategoryFilterBar category={category} className="flex flex-wrap gap-2 lg:hidden" />

          {/* Region filter */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#6F2380]/10">
            <p className="text-sm font-black text-[#6F2380]">Poloha</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {EVENT_REGION_FILTER_OPTIONS.map((r) => {
                const active = r.value === region;
                return (
                  <button
                    key={r.value || "all"}
                    type="button"
                    onClick={() => setRegion(active ? "" : r.value)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                      active
                        ? "bg-[#6F2380] text-white"
                        : "bg-[#6F2380]/8 text-[#6F2380]/70 hover:bg-[#6F2380]/15"
                    }`}
                  >
                    {r.label}
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
    </>
  );
}
