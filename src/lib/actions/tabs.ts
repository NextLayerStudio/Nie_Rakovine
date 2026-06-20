"use server";

import { prisma } from "@/lib/prisma";
import { requireActionUser } from "@/lib/safe-action";
import { loadFeedEngagement } from "@/lib/feed-engagement";
import { relevantWhere, sortByRelevance } from "@/lib/cancer-personalization";
import { distanceKm } from "@/lib/geo";
import {
  FEED_POST_POOL,
  FEED_EVENT_LIMIT,
  CALENDAR_EVENT_LIMIT,
  LIST_POST_LIMIT,
  SEARCH_PROFILE_LIMIT,
  feedPostSelect,
  feedEventSelect,
} from "@/lib/feed-queries";
import type { CancerType } from "@prisma/client";

async function getTabUserProfile(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
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
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false as const };

  const dbUser = await getTabUserProfile(auth.user.id);
  const userTypes = (dbUser.profile?.cancerTypes ?? []) as CancerType[];
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

  const { likedIds, savedIds, followingIds, registeredEventIds } =
    await loadFeedEngagement(auth.user.id, postIds, profileIds, eventIds);

  return {
    ok: true as const,
    posts,
    events,
    likedPostIds: [...likedIds],
    savedPostIds: [...savedIds],
    followingProfileIds: [...followingIds],
    registeredEventIds: [...registeredEventIds],
    userTypes,
    userName: dbUser.fullName,
  };
}

export async function fetchForumsTabAction() {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false as const };

  const dbUser = await getTabUserProfile(auth.user.id);
  const userTypes = (dbUser.profile?.cancerTypes ?? []) as CancerType[];
  const relevant = relevantWhere(userTypes);

  const [forumsRaw, pendingForums, memberships] = await Promise.all([
    prisma.forum.findMany({
      where: { published: true, ...relevant },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { members: true } } },
    }),
    prisma.forum.findMany({
      where: { published: false, createdById: auth.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.forumMembership.findMany({
      where: { userId: auth.user.id },
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
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false as const };

  const dbUser = await getTabUserProfile(auth.user.id);
  const userTypes = (dbUser.profile?.cancerTypes ?? []) as CancerType[];

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
        profile: { select: { displayName: true, handle: true } },
      },
    }),
    prisma.eventRegistration.findMany({
      where: { userId: auth.user.id },
      select: { eventId: true },
    }),
  ]);

  const registeredIds = new Set(registrations.map((r) => r.eventId));
  const me = {
    latitude: dbUser.profile?.latitude ?? null,
    longitude: dbUser.profile?.longitude ?? null,
  };

  return {
    ok: true as const,
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
      distanceKm: distanceKm(me, e),
    })),
    hasLocation: me.latitude !== null && me.longitude !== null,
    radiusKm: dbUser.profile?.notifyRadiusKm ?? 50,
  };
}

export async function searchTabAction(query: string) {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false as const };

  const q = query.trim();
  const ci = (field: string) =>
    ({ [field]: { contains: q, mode: "insensitive" as const } });

  const profileWhere = {
    published: true,
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

  const [profiles, posts, events] = await Promise.all([
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

  const postIds = posts.map((p) => p.id);
  const profileIds = [
    ...new Set(
      [...posts.map((p) => p.profileId), ...events.map((e) => e.profileId)].filter(
        (id): id is string => !!id,
      ),
    ),
  ];
  const { likedIds, savedIds, followingIds, registeredEventIds } =
    await loadFeedEngagement(
      auth.user.id,
      postIds,
      profileIds,
      events.map((e) => e.id),
    );

  const dbUser = await getTabUserProfile(auth.user.id);

  return {
    ok: true as const,
    profiles,
    posts,
    events,
    likedPostIds: [...likedIds],
    savedPostIds: [...savedIds],
    followingProfileIds: [...followingIds],
    registeredEventIds: [...registeredEventIds],
    userName: dbUser.fullName,
  };
}
