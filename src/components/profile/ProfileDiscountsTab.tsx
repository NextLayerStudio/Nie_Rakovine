import Link from "next/link";
import { DiscountOfferCard } from "@/components/discounts/DiscountOfferCard";
import { DiscountBrandCircle } from "@/components/discounts/DiscountUi";

export type ProfileSavedDiscount = {
  offerId: string;
  title: string;
  description: string | null;
  discountText: string | null;
  promoCode: string | null;
  accentColor: string;
  imageUrl: string | null;
  validUntil: string | null;
  partnerHandle: string;
};

export type ProfileFeaturedBrand = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
};

export function ProfileDiscountsTab({
  savedDiscounts,
  featuredBrands,
}: {
  savedDiscounts: ProfileSavedDiscount[];
  featuredBrands: ProfileFeaturedBrand[];
}) {
  return (
    <div className="px-4 pb-6 pt-3">
      {featuredBrands.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-3 text-sm font-bold text-brand-purple">
            Zľavy pre teba
          </h2>
          <div className="grid grid-cols-3 gap-x-3 gap-y-4">
            {featuredBrands.map((brand) => (
              <DiscountBrandCircle
                key={brand.id}
                href={`/home/zlavy/${brand.handle}`}
                name={brand.displayName}
                avatarUrl={brand.avatarUrl}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-brand-purple">Moje zľavy</h2>
          <Link
            href="/home/zlavy"
            className="text-[11px] font-semibold text-brand-pink"
          >
            Všetky zľavy
          </Link>
        </div>

        {savedDiscounts.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-card">
            <p className="text-xs text-brand-purple/60">
              Uložte si zľavu kliknutím na ikonu záložky pri karte zľavy.
            </p>
            <Link
              href="/home/zlavy"
              className="mt-3 inline-flex rounded-pill bg-brand-pink px-4 py-2 text-xs font-bold text-white"
            >
              Prejsť na zľavy
            </Link>
          </div>
        ) : (
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <div className="flex w-max gap-3">
              {savedDiscounts.map((offer) => (
                <div key={offer.offerId} className="w-[280px] shrink-0">
                  <DiscountOfferCard
                    offerId={offer.offerId}
                    title={offer.title}
                    description={offer.description}
                    discountText={offer.discountText}
                    promoCode={offer.promoCode}
                    accentColor={offer.accentColor}
                    imageUrl={offer.imageUrl}
                    validUntil={
                      offer.validUntil ? new Date(offer.validUntil) : null
                    }
                    saved
                  />
                </div>
              ))}
            </div>
            {savedDiscounts.length > 1 && (
              <div className="mt-2 flex justify-center gap-1">
                {savedDiscounts.map((o) => (
                  <span
                    key={o.offerId}
                    className="h-1.5 w-1.5 rounded-full bg-brand-purple/25"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
