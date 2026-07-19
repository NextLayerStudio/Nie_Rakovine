"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type EventsFilterContextValue = {
  filtersOpen: boolean;
  openFilters: () => void;
  closeFilters: () => void;
};

const EventsFilterContext = createContext<EventsFilterContextValue | null>(null);

// Shares the mobile filter-drawer open/closed state between the header
// toggle button and the category/poloha/kalendár drawer rendered further
// down the /podujatia page.
export function EventsFilterProvider({ children }: { children: ReactNode }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <EventsFilterContext.Provider
      value={{
        filtersOpen,
        openFilters: () => setFiltersOpen(true),
        closeFilters: () => setFiltersOpen(false),
      }}
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
