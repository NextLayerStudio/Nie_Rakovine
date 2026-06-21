"use server";

import type { DiscountCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireActionUser } from "@/lib/safe-action";
import {
  ALL_CATEGORIES_SLUG,
  categoryFromSlug,
  categoryLabel,
} from "@/lib/discount-category";

export async function fetchDiscountSearchHintsAction(params: {
  query: string;
  categorySlug?: string;
}) {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false as const, hints: [] };

  const q = params.query.trim();
  if (q.length < 1) return { ok: true as const, hints: [] };

  const parsed = params.categorySlug
    ? categoryFromSlug(params.categorySlug)
    : null;
  const categoryFilter =
    parsed && parsed !== ALL_CATEGORIES_SLUG
      ? { category: parsed as DiscountCategory }
      : {};

  const partners = await prisma.discountPartner.findMany({
    where: {
      published: true,
      ...categoryFilter,
      OR: [
        { displayName: { contains: q, mode: "insensitive" } },
        { bio: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
    take: 8,
    select: {
      handle: true,
      displayName: true,
      avatarUrl: true,
      category: true,
    },
  });

  return {
    ok: true as const,
    hints: partners.map((p) => ({
      handle: p.handle,
      name: p.displayName,
      avatarUrl: p.avatarUrl,
      category: categoryLabel(p.category),
    })),
  };
}
