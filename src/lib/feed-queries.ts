import type { Prisma } from "@prisma/client";

/** Recent posts loaded for home feed (personalised sort happens in memory). */
export const FEED_POST_POOL = 60;
export const FEED_EVENT_LIMIT = 20;
export const FEED_DISPLAY_LIMIT = 50;
export const LIST_POST_LIMIT = 40;
export const SEARCH_PROFILE_LIMIT = 40;
export const CALENDAR_EVENT_LIMIT = 120;
export const PROFILE_POST_LIMIT = 30;
export const PROFILE_EVENT_LIMIT = 20;
export const PROFILES_LIST_LIMIT = 80;

export const feedProfileSelect = {
  id: true,
  handle: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.ClubProfileSelect;

export const feedDiscountPartnerSelect = {
  id: true,
  handle: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.DiscountPartnerSelect;

export const feedPostSelect = {
  id: true,
  profileId: true,
  type: true,
  title: true,
  excerpt: true,
  coverUrl: true,
  videoUrl: true,
  audioUrl: true,
  durationSec: true,
  publishedAt: true,
  createdAt: true,
  cancerTypes: true,
  profile: { select: feedProfileSelect },
  discountPartner: { select: feedDiscountPartnerSelect },
  linkedOfferId: true,
  images: {
    orderBy: { sortOrder: "asc" as const },
    select: { id: true, url: true, sortOrder: true },
  },
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.PostSelect;

export const feedEventSelect = {
  id: true,
  profileId: true,
  title: true,
  description: true,
  coverUrl: true,
  location: true,
  startsAt: true,
  endsAt: true,
  cancerTypes: true,
  profile: { select: feedProfileSelect },
  capacity: true,
  isPaid: true,
  priceCents: true,
  currency: true,
  _count: { select: { registrations: true, likes: true, comments: true } },
} satisfies Prisma.EventSelect;

export const listPostSelect = {
  id: true,
  type: true,
  title: true,
  excerpt: true,
  coverUrl: true,
  images: {
    orderBy: { sortOrder: "asc" as const },
    select: { url: true },
  },
  _count: { select: { likes: true } },
} satisfies Prisma.PostSelect;

export type FeedPostRow = Prisma.PostGetPayload<{ select: typeof feedPostSelect }>;
export type FeedEventRow = Prisma.EventGetPayload<{ select: typeof feedEventSelect }>;
export type ListPostRow = Prisma.PostGetPayload<{ select: typeof listPostSelect }>;
