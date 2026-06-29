"use server";

import { prisma } from "@/lib/prisma";
import { loadFeedEngagement } from "@/lib/feed-engagement";
import { relevantWhere, sortByRelevance } from "@/lib/cancer-personalization";
import { distanceKm } from "@/lib/geo";
import { readSession } from "@/lib/auth";
import {
  FEED_POST_POOL,
  FEED_EVENT_LIMIT,
  CALENDAR_EVENT_LIMIT,
  LIST_POST_LIMIT,
  SEARCH_PROFILE_LIMIT,
  feedPostSelect,
  feedEventSelect,
} from "@/lib/feed-queries";
import type { CancerType, ProfileCategory } from "@prisma/client";

/** Single DB call that combines auth + profile — replaces 2 sequential queries. */
async function getTabUser() {
  const session = await readSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      fullName: true,
      profile: {
        select: {
          cancerTypes: true,
          latitude: true,
          longitude: true,
          notifyRadiusKm: true,
        },
      },
    },
  });
}

export async function fetchFeedTabAction() {
  const user = await getTabUser();
  if (!user) return { ok: false as const };

  const userTypes = (user.profile?.cancerTypes ?? []) as CancerType[];
  const relevant = relevantWhere(userTypes);

  const [posts, events] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, ...relevant },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: FEED_POST_POOL,
      select: feedPostSelect,
    }),
    prisma.event.findMany({
      where: { published: true, ...relevant },
      orderBy: { startsAt: "desc" },
      take: FEED_EVENT_LIMIT,
      select: feedEventSelect,
    }),
  ]);

  const postIds = posts.map((p) => p.id);
  const profileIds = [
    ...new Set(
      [...posts.map((p) => p.profileId), ...events.map((e) => e.profileId)].filter(
        (id): id is string => !!id,
      ),
    ),
  ];
  const eventIds = events.map((e) => e.id);

  const { likedIds, savedIds, followingIds, registeredEventIds, likedEventIds } =
    await loadFeedEngagement(user.id, postIds, profileIds, eventIds);

  return {
    ok: true as const,
    posts,
    events,
    likedPostIds: [...likedIds],
    savedPostIds: [...savedIds],
    followingProfileIds: [...followingIds],
    registeredEventIds: [...registeredEventIds],
    likedEventIds: [...likedEventIds],
    userTypes,
    userName: user.fullName,
  };
}

export async function fetchForumsTabAction() {
  const user = await getTabUser();
  if (!user) return { ok: false as const };

  const userTypes = (user.profile?.cancerTypes ?? []) as CancerType[];
  const relevant = relevantWhere(userTypes);

  const [forumsRaw, pendingForums, memberships] = await Promise.all([
    prisma.forum.findMany({
      where: { published: true, ...relevant },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { members: true } } },
    }),
    prisma.forum.findMany({
      where: { published: false, createdById: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.forumMembership.findMany({
      where: { userId: user.id },
      select: { forumId: true },
    }),
  ]);

  return {
    ok: true as const,
    forums: sortByRelevance(forumsRaw, userTypes),
    pendingForums,
    followingForumIds: memberships.map((m) => m.forumId),
    userTypes,
  };
}

export async function fetchCalendarTabAction() {
  const user = await getTabUser();
  if (!user) return { ok: false as const };

  const userTypes = (user.profile?.cancerTypes ?? []) as CancerType[];
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [events, registrations] = await Promise.all([
    prisma.event.findMany({
      where: {
        published: true,
        startsAt: { gte: sixMonthsAgo },
        ...relevantWhere(userTypes),
      },
      orderBy: { startsAt: "asc" },
      take: CALENDAR_EVENT_LIMIT,
      select: {
        ...feedEventSelect,
        category: true,
        latitude: true,
        longitude: true,
        capacity: true,
        _count: { select: { registrations: true } },
        profile: { select: { displayName: true, handle: true } },
      },
    }),
    prisma.eventRegistration.findMany({
      where: { userId: user.id },
      select: {
        eventId: true,
        paymentStatus: true,
        event: { select: { isPaid: true } },
      },
    }),
  ]);

  const registeredIds = new Set(
    registrations
      .filter((r) => !r.event.isPaid || r.paymentStatus === "PAID")
      .map((r) => r.eventId),
  );
  const pendingPaymentIds = new Set(
    registrations
      .filter((r) => r.event.isPaid && r.paymentStatus === "PENDING")
      .map((r) => r.eventId),
  );
  const me = {
    latitude: user.profile?.latitude ?? null,
    longitude: user.profile?.longitude ?? null,
  };
  const nameParts = user.fullName.trim().split(/\s+/).filter(Boolean);

  return {
    ok: true as const,
    defaultName: nameParts[0] ?? "",
    defaultSurname: nameParts.slice(1).join(" "),
    events: events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      coverUrl: e.coverUrl,
      category: e.category,
      startsAt: e.startsAt.toISOString(),
      endsAt: e.endsAt ? e.endsAt.toISOString() : null,
      profileName: e.profile?.displayName ?? "ONKO KLUB",
      registered: registeredIds.has(e.id),
      registrationCount: e._count.registrations,
      capacity: e.capacity,
      distanceKm: distanceKm(me, e),
      isPaid: e.isPaid,
      priceCents: e.priceCents,
      currency: e.currency,
      pendingPayment: pendingPaymentIds.has(e.id),
    })),
    hasLocation: me.latitude !== null && me.longitude !== null,
    radiusKm: user.profile?.notifyRadiusKm ?? 50,
  };
}

export async function searchTabAction(query: string, category?: string | null) {
  const q = query.trim();
  const ci = (field: string) =>
    ({ [field]: { contains: q, mode: "insensitive" as const } });

  const profileWhere = {
    published: true,
    ...(category ? { category: category as ProfileCategory } : {}),
    ...(q ? { OR: [ci("displayName"), ci("handle"), ci("bio")] } : {}),
  };
  const postWhere = {
    published: true,
    ...(q ? { OR: [ci("title"), ci("excerpt")] } : {}),
  };
  const eventWhere = {
    published: true,
    ...(q ? { OR: [ci("title"), ci("description")] } : {}),
  };

  // Run auth + all data queries in parallel (search doesn't need user types for filtering)
  const [user, profiles, posts, events] = await Promise.all([
    getTabUser(),
    prisma.clubProfile.findMany({
      where: profileWhere,
      orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
      take: SEARCH_PROFILE_LIMIT,
      select: {
        id: true,
        handle: true,
        displayName: true,
        avatarUrl: true,
        _count: { select: { posts: true, events: true } },
      },
    }),
    prisma.post.findMany({
      where: postWhere,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: LIST_POST_LIMIT,
      select: feedPostSelect,
    }),
    prisma.event.findMany({
      where: eventWhere,
      orderBy: { startsAt: "asc" },
      take: 20,
      select: feedEventSelect,
    }),
  ]);

  if (!user) return { ok: false as const };

  const postIds = posts.map((p) => p.id);
  const profileIds = [
    ...new Set(
      [
        ...profiles.map((p) => p.id),
        ...posts.map((p) => p.profileId),
        ...events.map((e) => e.profileId),
      ].filter((id): id is string => !!id),
    ),
  ];
  const { likedIds, savedIds, followingIds, registeredEventIds } =
    await loadFeedEngagement(
      user.id,
      postIds,
      profileIds,
      events.map((e) => e.id),
    );

  return {
    ok: true as const,
    profiles,
    posts,
    events,
    likedPostIds: [...likedIds],
    savedPostIds: [...savedIds],
    followingProfileIds: [...followingIds],
    registeredEventIds: [...registeredEventIds],
    userName: user.fullName,
  };
}
