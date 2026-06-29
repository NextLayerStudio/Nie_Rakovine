"use client";

import { useState } from "react";
import Link from "next/link";
import { DiscountOfferCard } from "@/components/discounts/DiscountOfferCard";
import { discountCardHref } from "@/lib/post-display";

export type DiscountProfilePost = {
  id: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  linkedOfferId: string | null;
};

export type DiscountProfileOffer = {
  id: string;
  title: string;
  description: string | null;
  discountText: string | null;
  accentColor: string;
  imageUrl: string | null;
  validUntil: string | null;
  saved: boolean;
};

type Tab = "posts" | "offers";

export function DiscountProfileTabs({
  handle,
  posts,
  offers,
}: {
  handle: string;
  posts: DiscountProfilePost[];
  offers: DiscountProfileOffer[];
}) {
  const [tab, setTab] = useState<Tab>("posts");

  return (
    <div className="px-5 pb-10">
      <div
        role="tablist"
        aria-label="Sekcie profilu"
        className="mb-4 flex gap-2"
      >
        <TabButton active={tab === "posts"} onClick={() => setTab("posts")}>
          Príspevky
        </TabButton>
        <TabButton active={tab === "offers"} onClick={() => setTab("offers")}>
          Zľavy
        </TabButton>
      </div>

      {tab === "posts" ? (
        posts.length === 0 ? (
          <EmptyState text="Zatiaľ žiadne príspevky." />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const href = post.linkedOfferId
                ? discountCardHref(handle, post.linkedOfferId)
                : null;
              const inner = (
                <>
                  {post.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverUrl}
                      alt={post.title}
                      className="block w-full"
                      draggable={false}
                    />
                  )}
                  {(post.title || post.excerpt) && (
                    <div className="p-4">
                      {post.title && (
                        <h3 className="text-base font-bold text-brand-purple">
                          {post.title}
                        </h3>
                      )}
                      {post.excerpt && (
                        <p className="mt-1 text-sm leading-relaxed text-brand-purple/70">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  )}
                </>
              );
              return href ? (
                <Link
                  key={post.id}
                  href={href}
                  className="block overflow-hidden rounded-3xl bg-white shadow-card"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={post.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-card"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        )
      ) : offers.length === 0 ? (
        <EmptyState text="Zatiaľ žiadne zľavové karty." />
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <DiscountOfferCard
              key={offer.id}
              offerId={offer.id}
              title={offer.title}
              description={offer.description}
              discountText={offer.discountText}
              accentColor={offer.accentColor}
              imageUrl={offer.imageUrl}
              validUntil={offer.validUntil}
              saved={offer.saved}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-pill px-5 py-2 text-sm font-bold transition ${
        active
          ? "bg-brand-pink text-white shadow-sm"
          : "border-2 border-brand-purple/15 text-brand-purple/70 hover:bg-brand-purple/5"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="py-10 text-center text-sm text-brand-purple/55">{text}</p>
  );
}
