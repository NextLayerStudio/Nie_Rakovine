"use client";

import { SaveDiscountButton } from "@/components/discounts/SaveDiscountButton";

function formatValidUntil(validUntil: string | null): string | null {
  if (!validUntil) return null;
  const date = new Date(validUntil);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("sk-SK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export function DiscountOfferCard({
  title,
  description,
  discountText,
  accentColor,
  imageUrl,
  validUntil,
  saved,
  offerId,
}: {
  title: string;
  description: string | null;
  discountText: string | null;
  accentColor: string;
  imageUrl: string | null;
  validUntil: string | null;
  saved: boolean;
  offerId: string;
}) {
  const validUntilLabel = formatValidUntil(validUntil);
  const hasText = Boolean(
    discountText || (title && title.trim()) || description,
  );

  // Image-only card: show just the uploaded graphic with a save button.
  if (imageUrl && !hasText) {
    return (
      <article className="relative overflow-hidden rounded-3xl shadow-card">
        <div className="absolute right-3 top-3 z-10">
          <SaveDiscountButton offerId={offerId} saved={saved} />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title || "Zľavová karta"}
          className="block w-full"
          draggable={false}
        />
      </article>
    );
  }

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
        {title && title.trim() && (
          <h3 className="mt-1 text-lg font-bold leading-snug text-brand-purple">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-brand-purple/75">
            {description}
          </p>
        )}
        {validUntilLabel && (
          <p className="mt-2 text-[11px] font-medium text-brand-purple/60">
            Platí do {validUntilLabel}
          </p>
        )}
      </div>
    </article>
  );
}
