"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type EventsFilterContextValue = {
  filtersOpen: boolean;
  toggleFilters: () => void;
};

const EventsFilterContext = createContext<EventsFilterContextValue | null>(null);

// Shares the mobile filter-panel open/closed state between the header
// toggle button and the category/poloha/kalendár filters rendered further
// down the /podujatia page.
export function EventsFilterProvider({ children }: { children: ReactNode }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <EventsFilterContext.Provider
      value={{ filtersOpen, toggleFilters: () => setFiltersOpen((v) => !v) }}
    >
      {children}
    </EventsFilterContext.Provider>
  );
}

export function useEventsFilter() {
  const ctx = useContext(EventsFilterContext);
  if (!ctx) throw new Error("useEventsFilter must be used within EventsFilterProvider");
  return ctx;
}
