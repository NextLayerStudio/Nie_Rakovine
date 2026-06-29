"use server";

import { prisma } from "@/lib/prisma";
import { isEventRegistrationComplete } from "@/lib/event-payment";
import { visibleThreadsWhere, approvedCommentsCountWhere } from "@/lib/forum-moderation";

export async function loadProfileCalendarData(userId: string, fullName: string) {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId, event: { published: true } },
    orderBy: { event: { startsAt: "asc" } },
    select: {
      paymentStatus: true,
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          coverUrl: true,
          startsAt: true,
          endsAt: true,
          location: true,
          capacity: true,
          isPaid: true,
          priceCents: true,
          currency: true,
          _count: { select: { registrations: true } },
        },
      },
    },
  });

  return {
    ok: true as const,
    defaultName: nameParts[0] ?? "",
    defaultSurname: nameParts.slice(1).join(" "),
    registeredEvents: registrations
      .filter((r) => isEventRegistrationComplete(r, r.event.isPaid))
      .map((r) => ({
        id: r.event.id,
        title: r.event.title,
        description: r.event.description,
        coverUrl: r.event.coverUrl,
        startsAt: r.event.startsAt.toISOString(),
        endsAt: r.event.endsAt?.toISOString() ?? null,
        location: r.event.location,
        registrationCount: r.event._count.registrations,
        capacity: r.event.capacity,
        isPaid: r.event.isPaid,
        priceCents: r.event.priceCents,
        currency: r.event.currency,
      })),
  };
}

export async function loadProfileForumsData(userId: string, fullName: string) {
  const activityCutoff = new Date();
  activityCutoff.setDate(activityCutoff.getDate() - 14);
  const conversationCutoff = new Date();
  conversationCutoff.setDate(conversationCutoff.getDate() - 60);

  const memberships = await prisma.forumMembership.findMany({
    where: { userId, forum: { published: true } },
    orderBy: { createdAt: "desc" },
    select: {
      forum: {
        select: { id: true, title: true, imageUrl: true, accentColor: true },
      },
    },
  });

  const followedForumIds = memberships.map((m) => m.forum.id);

  const [recentActivity, userForumThreads] = await Promise.all([
    followedForumIds.length > 0
      ? prisma.forumThread.findMany({
          where: {
            forumId: { in: followedForumIds },
            status: "APPROVED",
            createdAt: { gte: activityCutoff },
          },
          select: { forumId: true },
          distinct: ["forumId"],
        })
      : Promise.resolve([]),
    prisma.forumThread.findMany({
      where: {
        authorId: userId,
        createdAt: { gte: conversationCutoff },
        forum: { published: true },
        ...visibleThreadsWhere(userId),
      },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        body: true,
        title: true,
        status: true,
        coverUrl: true,
        likeCount: true,
        forum: {
          select: { id: true, title: true, imageUrl: true, accentColor: true },
        },
        _count: { select: { comments: approvedCommentsCountWhere() } },
      },
    }),
  ]);

  const threadIds = userForumThreads.map((t) => t.id);
  const likedThreadIds =
    threadIds.length > 0
      ? new Set(
          (
            await prisma.forumThreadLike.findMany({
              where: { userId, threadId: { in: threadIds } },
              select: { threadId: true },
            })
          ).map((l) => l.threadId),
        )
      : new Set<string>();

  const activeForumIds = new Set(recentActivity.map((t) => t.forumId));

  return {
    ok: true as const,
    forums: memberships.map((m) => ({
      id: m.forum.id,
      title: m.forum.title,
      imageUrl: m.forum.imageUrl,
      accentColor: m.forum.accentColor,
      hasRecentActivity: activeForumIds.has(m.forum.id),
    })),
    forumPosts: userForumThreads.map((t) => ({
      forumId: t.forum.id,
      threadId: t.id,
      authorName: fullName,
      title: t.title,
      body: t.body,
      coverUrl: t.coverUrl,
      liked: likedThreadIds.has(t.id),
      likeCount: t.likeCount,
      commentCount: t._count.comments,
      isPending: t.status !== "APPROVED",
    })),
  };
}

export async function loadProfileDiscountsData(userId: string) {
  const [featuredBrands, savedDiscountRows] = await Promise.all([
    prisma.discountPartner.findMany({
      where: { published: true, featured: true },
      orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
      take: 6,
      select: { id: true, handle: true, displayName: true, avatarUrl: true },
    }),
    prisma.savedDiscountOffer.findMany({
      where: {
        userId,
        offer: { published: true, partner: { published: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        offer: {
          select: {
            id: true,
            title: true,
            description: true,
            discountText: true,
            promoCode: true,
            accentColor: true,
            imageUrl: true,
            validUntil: true,
            partner: { select: { handle: true } },
          },
        },
      },
    }),
  ]);

  return {
    ok: true as const,
    featuredBrands: featuredBrands.map((b) => ({
      id: b.id,
      handle: b.handle,
      displayName: b.displayName,
      avatarUrl: b.avatarUrl,
    })),
    savedDiscounts: savedDiscountRows.map((row) => ({
      offerId: row.offer.id,
      title: row.offer.title,
      description: row.offer.description,
      discountText: row.offer.discountText,
      promoCode: row.offer.promoCode,
      accentColor: row.offer.accentColor ?? "#F5D5E0",
      imageUrl: row.offer.imageUrl,
      validUntil: row.offer.validUntil?.toISOString() ?? null,
      partnerHandle: row.offer.partner.handle,
    })),
  };
}
