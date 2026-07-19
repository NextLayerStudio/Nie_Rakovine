"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEventsFilter } from "./EventsFilterContext";

// Mobile-only hamburger-style toggle for the kategória/poloha/kalendár
// filters on /podujatia — sits in the header, level with the logo.
export function EventsFilterToggle() {
  const { filtersOpen, toggleFilters } = useEventsFilter();
  return (
    <button
      type="button"
      onClick={toggleFilters}
      aria-expanded={filtersOpen}
      aria-label={filtersOpen ? "Skryť filtre" : "Zobraziť filtre"}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FDA4C7] text-white lg:hidden"
    >
      {filtersOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
    </button>
  );
}
