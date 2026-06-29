import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { DiscountOfferCard } from "@/components/discounts/DiscountOfferCard";
import { categoryLabel, categorySlug, offerCardColor } from "@/lib/discount-category";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DiscountPartnerPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const user = await requireUser();
  const { handle } = await params;

  const partner = await prisma.discountPartner.findFirst({
    where: { handle, published: true },
    include: {
      offers: {
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!partner) notFound();

  const savedRows = partner.offers.length
    ? await prisma.savedDiscountOffer.findMany({
        where: {
          userId: user.id,
          offerId: { in: partner.offers.map((o) => o.id) },
        },
        select: { offerId: true },
      })
    : [];
  const savedIds = new Set(savedRows.map((r) => r.offerId));

  return (
    <>
      <FeedHeaderWrapper />

      <div className="flex items-center gap-2 px-5 pb-1 pt-1">
        <Link
          href={`/home/zlavy/kategoria/${categorySlug(partner.category)}`}
          className="text-sm font-semibold text-brand-purple/60"
        >
          ← {categoryLabel(partner.category)}
        </Link>
      </div>

      <section className="flex items-center gap-4 px-5 pb-4">
        <div
          className="h-16 w-16 shrink-0 rounded-full bg-cover bg-center ring-2 ring-brand-purple/10"
          style={profileAvatarStyle(partner.avatarUrl)}
          aria-hidden
        />
        <div>
          <h1 className="text-lg font-bold text-brand-purple">
            {partner.displayName}
          </h1>
          {partner.bio && (
            <p className="mt-0.5 text-xs text-brand-purple/65">{partner.bio}</p>
          )}
        </div>
      </section>

      <section className="space-y-4 px-5 pb-10">
        {partner.offers.length === 0 ? (
          <p className="py-8 text-center text-sm text-brand-purple/60">
            Táto značka zatiaľ nemá žiadne zľavové karty.
          </p>
        ) : (
          partner.offers.map((offer, index) => (
            <DiscountOfferCard
              key={offer.id}
              offerId={offer.id}
              title={offer.title}
              description={offer.description}
              discountText={offer.discountText}
              accentColor={offerCardColor(index, offer.accentColor)}
              imageUrl={offer.imageUrl}
              validUntil={offer.validUntil?.toISOString() ?? null}
              saved={savedIds.has(offer.id)}
            />
          ))
        )}
      </section>
    </>
  );
}
