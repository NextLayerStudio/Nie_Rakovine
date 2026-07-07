import type { EventRegion } from "@prisma/client";

export const EVENT_REGIONS: EventRegion[] = [
  "BRATISLAVSKY",
  "TRNAVSKY",
  "TRENCIANSKY",
  "NITRIANSKY",
  "ZILINSKY",
  "BANSKOBYSTRICKY",
  "PRESOVSKY",
  "KOSICKY",
];

export const EVENT_REGION_LABELS: Record<EventRegion, string> = {
  BRATISLAVSKY: "Bratislavský kraj",
  TRNAVSKY: "Trnavský kraj",
  TRENCIANSKY: "Trenčiansky kraj",
  NITRIANSKY: "Nitriansky kraj",
  ZILINSKY: "Žilinský kraj",
  BANSKOBYSTRICKY: "Banskobystrický kraj",
  PRESOVSKY: "Prešovský kraj",
  KOSICKY: "Košický kraj",
};

export function regionLabel(region: EventRegion | null | undefined): string | null {
  return region ? EVENT_REGION_LABELS[region] : null;
}

/** Region filter chips for the public /podujatia page — "Všetky" first. */
export const EVENT_REGION_FILTER_OPTIONS: { value: EventRegion | ""; label: string }[] = [
  { value: "", label: "Všetky" },
  ...EVENT_REGIONS.map((r) => ({ value: r, label: EVENT_REGION_LABELS[r] })),
];
