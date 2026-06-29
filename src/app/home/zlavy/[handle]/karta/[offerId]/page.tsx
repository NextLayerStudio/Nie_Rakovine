import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { DiscountOfferCard } from "@/components/discounts/DiscountOfferCard";
import { offerCardColor } from "@/lib/discount-category";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DiscountCardPage({
  params,
}: {
  params: Promise<{ handle: string; offerId: string }>;
}) {
  const user = await requireUser();
  const { handle, offerId } = await params;

  const offer = await prisma.discountOffer.findFirst({
    where: {
      id: offerId,
      published: true,
      partner: { handle, published: true },
    },
    include: { partner: true },
  });

  if (!offer) notFound();

  const saved = await prisma.savedDiscountOffer.findUnique({
    where: { userId_offerId: { userId: user.id, offerId: offer.id } },
    select: { id: true },
  });

  return (
    <>
      <FeedHeaderWrapper />

      <div className="flex items-center gap-2 px-5 pb-1 pt-1">
        <Link
          href={`/home/zlavy/${handle}`}
          className="text-sm font-semibold text-brand-purple/60"
        >
          ← {offer.partner.displayName}
        </Link>
      </div>

      <section className="flex items-center gap-4 px-5 pb-4">
        <div
          className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center ring-2 ring-brand-purple/10"
          style={profileAvatarStyle(offer.partner.avatarUrl)}
          aria-hidden
        />
        <h1 className="text-base font-bold text-brand-purple">
          {offer.partner.displayName}
        </h1>
      </section>

      <section className="px-5 pb-10">
        <DiscountOfferCard
          offerId={offer.id}
          title={offer.title}
          description={offer.description}
          discountText={offer.discountText}
          accentColor={offerCardColor(0, offer.accentColor)}
          imageUrl={offer.imageUrl}
          validUntil={offer.validUntil?.toISOString() ?? null}
          saved={Boolean(saved)}
        />
      </section>
    </>
  );
}
