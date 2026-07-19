"use client";

import { SlidersHorizontal } from "lucide-react";
import { useEventsFilter } from "./EventsFilterContext";

// Mobile-only hamburger-style toggle for the kategória/poloha/kalendár
// filters on /podujatia — sits in the header, level with the logo. Opens
// the same slide-in drawer used elsewhere in the app; closing happens via
// the drawer's own close button or backdrop, same as the main nav menu.
export function EventsFilterToggle() {
  const { filtersOpen, openFilters } = useEventsFilter();
  return (
    <button
      type="button"
      onClick={openFilters}
      aria-expanded={filtersOpen}
      aria-label="Zobraziť filtre"
      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FDA4C7] text-white lg:hidden"
    >
      <SlidersHorizontal size={18} />
    </button>
  );
}
