import type { EventCategory } from "@prisma/client";

export const EVENT_CATEGORIES: EventCategory[] = [
  "EDUKACNE",
  "RELAXACNE",
  "FYZICKE",
  "MENTALNE",
  "EXTERNE",
  "INTERNE",
];

type CategoryMeta = { label: string; color: string; text: string };

/** Display label + tile colours (matching the calendar category tiles). */
export const EVENT_CATEGORY_META: Record<EventCategory, CategoryMeta> = {
  EDUKACNE: { label: "Vzdelávanie", color: "#A7E3B8", text: "#1f5132" },
  RELAXACNE: { label: "Relaxácia", color: "#A9AEEB", text: "#2a2e6b" },
  FYZICKE: { label: "Pohyb", color: "#F0A9D0", text: "#7a2357" },
  MENTALNE: { label: "Psychická podpora", color: "#E3A7E0", text: "#5f235f" },
  EXTERNE: { label: "Komunita", color: "#A7DCE3", text: "#1f4f57" },
  INTERNE: { label: "ÁNO ZDRAVIU", color: "#E3C9A7", text: "#6b4a1f" },
};

export function categoryLabel(category: EventCategory | null | undefined): string {
  return category ? EVENT_CATEGORY_META[category].label : "Aktivita";
}

/** Category filter chips for the public /podujatia page — "Všetky" first. */
export const EVENT_CATEGORY_FILTER_OPTIONS: { value: EventCategory | ""; label: string }[] = [
  { value: "", label: "Všetky" },
  ...EVENT_CATEGORIES.map((c) => ({ value: c, label: EVENT_CATEGORY_META[c].label })),
];
