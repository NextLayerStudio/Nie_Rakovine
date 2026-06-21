import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import {
  DiscountBrandCircle,
} from "@/components/discounts/DiscountUi";
import { DiscountSearchBar } from "@/components/discounts/DiscountSearchBar";
import {
  ALL_CATEGORIES_SLUG,
  DISCOUNT_CATEGORIES,
  categoryLabel,
  categorySlug,
} from "@/lib/discount-category";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DiscountsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireUser();
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const searchFilter: Prisma.DiscountPartnerWhereInput = query
    ? {
        OR: [
          { displayName: { contains: query, mode: "insensitive" } },
          { bio: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const [featured, categoriesPreview] = await Promise.all([
    prisma.discountPartner.findMany({
      where: { published: true, featured: true, ...searchFilter },
      orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
      take: 6,
    }),
    prisma.discountPartner.groupBy({
      by: ["category"],
      where: { published: true },
      _count: { _all: true },
    }),
  ]);

  const counts = new Map(
    categoriesPreview.map((row) => [row.category, row._count._all]),
  );

  return (
    <>
      <FeedHeaderWrapper />
      <DiscountSearchBar defaultQuery={query} />

      {featured.length > 0 && (
        <section className="px-5 pb-4 pt-2">
          <div className="grid grid-cols-3 gap-x-4 gap-y-5">
            {featured.map((partner) => (
              <DiscountBrandCircle
                key={partner.id}
                href={`/home/zlavy/${partner.handle}`}
                name={partner.displayName}
                avatarUrl={partner.avatarUrl}
              />
            ))}
          </div>
        </section>
      )}

      <section className="px-5 pb-8">
        <h2 className="mb-3 text-base font-bold text-brand-purple">Kategórie</h2>
        <div className="grid grid-cols-2 gap-3">
          <CategoryPill
            href={`/home/zlavy/kategoria/${ALL_CATEGORIES_SLUG}`}
            label="Všetky kategórie"
          />
          {DISCOUNT_CATEGORIES.map((category) => (
            <CategoryPill
              key={category}
              href={`/home/zlavy/kategoria/${categorySlug(category)}`}
              label={categoryLabel(category)}
              count={counts.get(category)}
            />
          ))}
        </div>
      </section>

      {query && featured.length === 0 && (
        <p className="px-5 pb-8 text-center text-sm text-brand-purple/60">
          Pre „{query}“ sme nenašli žiadne značky.
        </p>
      )}
    </>
  );
}

function CategoryPill({
  href,
  label,
  count,
}: {
  href: string;
  label: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[52px] items-center justify-center rounded-2xl border border-brand-purple/12 bg-white px-4 py-3 text-center text-sm font-semibold text-brand-purple shadow-card transition hover:border-brand-purple/25"
    >
      <span>
        {label}
        {typeof count === "number" && count > 0 && (
          <span className="ml-1 text-brand-purple/45">({count})</span>
        )}
      </span>
    </Link>
  );
}
