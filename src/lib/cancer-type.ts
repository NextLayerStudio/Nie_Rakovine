import type { CancerType } from "@prisma/client";

/**
 * Curated cancer-type taxonomy for ONKO KLUB.
 * Order roughly follows incidence on Slovakia (NCZI / Národný onkologický register)
 * plus other clinically relevant groups. Used for personalising content.
 */
export const CANCER_TYPES: CancerType[] = [
  "PRSNIK",
  "HRUBE_CREVO",
  "PLUCA",
  "PROSTATA",
  "KOZA",
  "KRCOK_MATERNICE",
  "TELO_MATERNICE",
  "VAJECNIKY",
  "MOCOVE_CESTY",
  "PODZALUDKOVA",
  "ZALUDOK",
  "PECEN",
  "LYMFOM",
  "LEUKEMIA",
  "MOZOG",
  "STITNA_ZLAZA",
  "HLAVA_KRK",
  "INE",
];

type CancerTypeMeta = { label: string; short: string };

export const CANCER_TYPE_META: Record<CancerType, CancerTypeMeta> = {
  PRSNIK: { label: "Rakovina prsníka", short: "Prsník" },
  HRUBE_CREVO: { label: "Hrubé črevo a konečník", short: "Hrubé črevo" },
  PLUCA: { label: "Rakovina pľúc", short: "Pľúca" },
  PROSTATA: { label: "Rakovina prostaty", short: "Prostata" },
  KOZA: { label: "Rakovina kože / melanóm", short: "Koža" },
  KRCOK_MATERNICE: { label: "Krčok maternice", short: "Krčok maternice" },
  TELO_MATERNICE: { label: "Telo maternice", short: "Maternica" },
  VAJECNIKY: { label: "Vaječníky", short: "Vaječníky" },
  MOCOVE_CESTY: { label: "Močový mechúr a obličky", short: "Močové cesty" },
  PODZALUDKOVA: { label: "Podžalúdková žľaza", short: "Pankreas" },
  ZALUDOK: { label: "Žalúdok", short: "Žalúdok" },
  PECEN: { label: "Pečeň a žlčové cesty", short: "Pečeň" },
  LYMFOM: { label: "Lymfóm", short: "Lymfóm" },
  LEUKEMIA: { label: "Leukémia / krvné nádory", short: "Leukémia" },
  MOZOG: { label: "Mozog a nervový systém", short: "Mozog" },
  STITNA_ZLAZA: { label: "Štítna žľaza", short: "Štítna žľaza" },
  HLAVA_KRK: { label: "Nádory hlavy a krku", short: "Hlava a krk" },
  INE: { label: "Iné / nešpecifikované", short: "Iné" },
};

export function cancerTypeLabel(type: CancerType): string {
  return CANCER_TYPE_META[type]?.label ?? String(type);
}

export function cancerTypeShort(type: CancerType): string {
  return CANCER_TYPE_META[type]?.short ?? String(type);
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
