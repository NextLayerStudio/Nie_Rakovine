import type { DiscountCategory } from "@prisma/client";

export const DISCOUNT_CATEGORIES: DiscountCategory[] = [
  "MODA",
  "KOZMETIKA",
  "JEDLO",
  "ZAZITKY",
];

export const DISCOUNT_CATEGORY_META: Record<
  DiscountCategory,
  { label: string; slug: string }
> = {
  MODA: { label: "Móda", slug: "moda" },
  KOZMETIKA: { label: "Kozmetika", slug: "kozmetika" },
  JEDLO: { label: "Jedlo", slug: "jedlo" },
  ZAZITKY: { label: "Zážitky", slug: "zazitky" },
};

export const ALL_CATEGORIES_SLUG = "vsetky";

export const OFFER_CARD_COLORS = [
  "#F5D5E0",
  "#B8D4E8",
  "#A8DDD6",
  "#E8D5F5",
  "#F5E8C8",
];

export function categoryLabel(category: DiscountCategory): string {
  return DISCOUNT_CATEGORY_META[category].label;
}

export function categorySlug(category: DiscountCategory): string {
  return DISCOUNT_CATEGORY_META[category].slug;
}

export function categoryFromSlug(
  slug: string,
): DiscountCategory | typeof ALL_CATEGORIES_SLUG | null {
  if (slug === ALL_CATEGORIES_SLUG) return ALL_CATEGORIES_SLUG;
  const match = DISCOUNT_CATEGORIES.find(
    (c) => DISCOUNT_CATEGORY_META[c].slug === slug,
  );
  return match ?? null;
}

export function parseDiscountCategory(value: string): DiscountCategory | null {
  return DISCOUNT_CATEGORIES.includes(value as DiscountCategory)
    ? (value as DiscountCategory)
    : null;
}

export function offerCardColor(index: number, fallback?: string | null): string {
  if (fallback) return fallback;
  return OFFER_CARD_COLORS[index % OFFER_CARD_COLORS.length];
}
