import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import {
  DiscountBrandRow,
} from "@/components/discounts/DiscountUi";
import { DiscountSearchBar } from "@/components/discounts/DiscountSearchBar";
import {
  ALL_CATEGORIES_SLUG,
  categoryFromSlug,
  categoryLabel,
} from "@/lib/discount-category";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DiscountCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  await requireUser();
  const { category: categoryParam } = await params;
  const { q } = await searchParams;
  const parsed = categoryFromSlug(categoryParam);
  if (!parsed) notFound();

  const query = q?.trim() ?? "";
  const searchFilter: Prisma.DiscountPartnerWhereInput = query
    ? {
        OR: [
          { displayName: { contains: query, mode: "insensitive" } },
          { bio: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const where: Prisma.DiscountPartnerWhereInput = {
    published: true,
    ...searchFilter,
    ...(parsed !== ALL_CATEGORIES_SLUG ? { category: parsed } : {}),
  };

  const partners = await prisma.discountPartner.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
  });

  const title =
    parsed === ALL_CATEGORIES_SLUG
      ? "Všetky kategórie"
      : categoryLabel(parsed);

  return (
    <>
      <FeedHeaderWrapper />

      <div className="flex items-center gap-2 px-5 pb-1 pt-1">
        <Link
          href="/home/zlavy"
          className="text-sm font-semibold text-brand-purple/60"
        >
          ← Zľavy
        </Link>
      </div>

      <section className="px-5 pb-2">
        <h1 className="text-lg font-bold text-brand-purple">{title}</h1>
      </section>

      <DiscountSearchBar
        defaultQuery={query}
        action={`/home/zlavy/kategoria/${categoryParam}`}
        categorySlug={categoryParam}
      />

      <section className="px-5 pb-8">
        {partners.length === 0 ? (
          <p className="py-8 text-center text-sm text-brand-purple/60">
            {query
              ? `Pre „${query}“ sme nenašli žiadne značky.`
              : "V tejto kategórii zatiaľ nie sú žiadne značky."}
          </p>
        ) : (
          <div>
            {partners.map((partner) => (
              <DiscountBrandRow
                key={partner.id}
                href={`/home/zlavy/${partner.handle}`}
                name={partner.displayName}
                avatarUrl={partner.avatarUrl}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
