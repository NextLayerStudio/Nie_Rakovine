import "server-only";

import type { CancerType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { loadFeedEngagement } from "@/lib/feed-engagement";
import { relevantWhere, sortByRelevance } from "@/lib/cancer-personalization";
import { distanceKm } from "@/lib/geo";
import {
  FEED_POST_POOL,
  FEED_EVENT_LIMIT,
  CALENDAR_EVENT_LIMIT,
  feedPostSelect,
  feedEventSelect,
} from "@/lib/feed-queries";

export type TabUserProfile = {
  cancerTypes: CancerType[];
  latitude: number | null;
  longitude: number | null;
  notifyRadiusKm: number | null;
} | null;

export async function loadFeedTabData(
  userId: string,
  fullName: string,
  profile: TabUserProfile,
) {
  const userTypes = (profile?.cancerTypes ?? []) as CancerType[];
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
    await loadFeedEngagement(userId, postIds, profileIds, eventIds);

  return {
    ok: true as const,
    posts,
    events,
    likedPostIds: [...likedIds],
    savedPostIds: [...savedIds],
    followingProfileIds: [...followingIds],
    registeredEventIds: [...registeredEventIds],
    userTypes,
    userName: fullName,
  };
}

export async function loadForumsTabData(userId: string, profile: TabUserProfile) {
  const userTypes = (profile?.cancerTypes ?? []) as CancerType[];
  const relevant = relevantWhere(userTypes);

  const [forumsRaw, pendingForums, memberships] = await Promise.all([
    prisma.forum.findMany({
      where: { published: true, ...relevant },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { members: true } } },
    }),
    prisma.forum.findMany({
      where: { published: false, createdById: userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.forumMembership.findMany({
      where: { userId },
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

export async function loadCalendarTabData(
  userId: string,
  fullName: string,
  profile: TabUserProfile,
) {
  const userTypes = (profile?.cancerTypes ?? []) as CancerType[];
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
      where: { userId },
      select: { eventId: true },
    }),
  ]);

  const registeredIds = new Set(registrations.map((r) => r.eventId));
  const me = {
    latitude: profile?.latitude ?? null,
    longitude: profile?.longitude ?? null,
  };
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

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
    })),
    hasLocation: me.latitude !== null && me.longitude !== null,
    radiusKm: profile?.notifyRadiusKm ?? 50,
  };
}
