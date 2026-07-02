import type { ProfileCategory } from "@prisma/client";

export const PROFILE_CATEGORY_LABELS: Record<ProfileCategory, string> = {
  ZDRAVA_VYZIVA: "Pohyb a zdravá výživa",
  SPONZORI: "Sponzori",
  DIAGNOZY: "Diagnózy",
  NOVINKY: "Novinky",
  AKCIE: "Akcie",
};

export function profileCategoryLabel(cat: ProfileCategory): string {
  return PROFILE_CATEGORY_LABELS[cat];
}
