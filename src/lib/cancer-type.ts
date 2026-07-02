import type { CancerType } from "@prisma/client";

/**
 * Curated cancer-type taxonomy for ONKO KLUB.
 * Order roughly follows incidence on Slovakia (NCZI / Národný onkologický register)
 * plus other clinically relevant groups. Used for personalising content.
 */
export const CANCER_TYPES: CancerType[] = [
  "PRSNIK",
  "HRUBE_CREVO",
  "KONECNIK",
  "PLUCA",
  "PROSTATA",
  "PODZALUDKOVA",
  "SEMENNIKY",
  "KOZA",
  "KRCOK_MATERNICE",
  "VAJECNIKY",
  "TELO_MATERNICE",
  "MOCOVE_CESTY",
  "INE",
];

type CancerTypeMeta = { label: string; short: string };

export const CANCER_TYPE_META: Record<CancerType, CancerTypeMeta> = {
  PRSNIK: { label: "Rakovina prsníka", short: "Prsník" },
  HRUBE_CREVO: { label: "Hrubé črevo", short: "Hrubé črevo" },
  KONECNIK: { label: "Konečník", short: "Konečník" },
  PLUCA: { label: "Rakovina pľúc", short: "Pľúca" },
  PROSTATA: { label: "Rakovina prostaty", short: "Prostata" },
  PODZALUDKOVA: { label: "Pankreas", short: "Pankreas" },
  SEMENNIKY: { label: "Semenníky", short: "Semenníky" },
  KOZA: { label: "Rakovina kože / melanóm", short: "Koža" },
  KRCOK_MATERNICE: { label: "Krčok maternice", short: "Krčok maternice" },
  VAJECNIKY: { label: "Vaječníky", short: "Vaječníky" },
  TELO_MATERNICE: { label: "Maternica", short: "Maternica" },
  MOCOVE_CESTY: { label: "Močový mechúr", short: "Močový mechúr" },
  INE: { label: "Iné / nešpecifikované", short: "Iné" },
};

export function cancerTypeLabel(type: CancerType): string {
  return CANCER_TYPE_META[type]?.label ?? String(type);
}

export function cancerTypeShort(type: CancerType): string {
  return CANCER_TYPE_META[type]?.short ?? String(type);
}

/** Human-readable list for profile / admin (e.g. "Rakovina prsníka, Lymfóm"). */
export function formatCancerTypes(types: CancerType[] | undefined | null): string {
  if (!types?.length) return "—";
  return types.map(cancerTypeLabel).join(", ");
}

/** Parse + validate cancer types coming from a form submission. */
export function parseCancerTypes(values: FormDataEntryValue[]): CancerType[] {
  const valid = new Set<string>(CANCER_TYPES);
  const out: CancerType[] = [];
  for (const v of values) {
    if (typeof v === "string" && valid.has(v) && !out.includes(v as CancerType)) {
      out.push(v as CancerType);
    }
  }
  return out;
}
