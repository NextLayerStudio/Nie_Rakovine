"use client";

import { SaveDiscountButton } from "@/components/discounts/SaveDiscountButton";

export function DiscountOfferCard({
  title,
  description,
  discountText,
  promoCode,
  accentColor,
  imageUrl,
  validUntil,
  saved,
  offerId,
}: {
  title: string;
  description: string | null;
  discountText: string | null;
  promoCode: string | null;
  accentColor: string;
  imageUrl: string | null;
  validUntil: Date | null;
  saved: boolean;
  offerId: string;
}) {
  return (
    <article
      className="relative overflow-hidden rounded-3xl shadow-card"
      style={{ backgroundColor: accentColor }}
    >
      <div className="absolute right-3 top-3 z-10">
        <SaveDiscountButton offerId={offerId} saved={saved} />
      </div>

      {imageUrl && (
        <div
          className="aspect-[16/7] w-full bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden
        />
      )}

      <div className={`p-5 ${imageUrl ? "" : "min-h-[160px] flex flex-col justify-end"}`}>
        {discountText && (
          <p className="text-3xl font-black tracking-tight text-brand-purple/90">
            {discountText}
          </p>
        )}
        <h3 className="mt-1 text-lg font-bold leading-snug text-brand-purple">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-brand-purple/75">
            {description}
          </p>
        )}
        {promoCode && (
          <p className="mt-3 inline-flex rounded-pill bg-white/70 px-3 py-1 text-xs font-bold tracking-wide text-brand-purple">
            Kód: {promoCode}
          </p>
        )}
        {validUntil && (
          <p className="mt-2 text-[11px] font-medium text-brand-purple/60">
            Platí do{" "}
            {validUntil.toLocaleDateString("sk-SK", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </article>
  );
}
