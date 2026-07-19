"use client";

import Link from "next/link";
import type { EventCategory } from "@prisma/client";
import { EVENT_CATEGORY_FILTER_OPTIONS } from "@/lib/event-category";
import { useEventsFilter } from "./EventsFilterContext";

function buildHref(category: string) {
  return category ? `/podujatia?category=${category}` : "/podujatia";
}

export function CategoryFilterBar({ category }: { category: EventCategory | "" }) {
  const { filtersOpen } = useEventsFilter();
  return (
    <div className={`mt-4 flex-wrap gap-2 lg:flex ${filtersOpen ? "flex" : "hidden"}`}>
      {EVENT_CATEGORY_FILTER_OPTIONS.map((c) => {
        const active = c.value === category;
        return (
          <Link
            key={c.value || "all"}
            href={buildHref(c.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              active
                ? "bg-[#6F2380] text-white"
                : "bg-white text-[#6F2380]/70 ring-1 ring-[#6F2380]/15 hover:ring-[#FDA4C7]/50"
            }`}
          >
            {c.label}
          </Link>
        );
      })}
    </div>
  );
}
