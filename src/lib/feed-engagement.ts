import "server-only";

import { prisma } from "@/lib/prisma";

/** Batch-load likes, saves, follows, and event registrations for feed pages. */
export async function loadFeedEngagement(
  userId: string,
  postIds: string[],
  profileIds: string[],
  eventIds: string[],
) {
  const [userLikes, userSaves, follows, eventRegistrations] = await Promise.all([
    postIds.length
      ? prisma.articleLike.findMany({
          where: { userId, postId: { in: postIds } },
          select: { postId: true },
        })
      : [],
    postIds.length
      ? prisma.savedPost.findMany({
          where: { userId, postId: { in: postIds } },
          select: { postId: true },
        })
      : [],
    profileIds.length
      ? prisma.profileFollow.findMany({
          where: { userId, profileId: { in: profileIds } },
          select: { profileId: true },
        })
      : [],
    eventIds.length
      ? prisma.eventRegistration.findMany({
          where: { userId, eventId: { in: eventIds } },
          select: {
            eventId: true,
            paymentStatus: true,
            event: { select: { isPaid: true } },
          },
        })
      : [],
  ]);

  return {
    likedIds: new Set(userLikes.map((l) => l.postId)),
    savedIds: new Set(userSaves.map((s) => s.postId)),
    followingIds: new Set(follows.map((f) => f.profileId)),
    registeredEventIds: new Set(
      eventRegistrations
        .filter(
          (r) => !r.event.isPaid || r.paymentStatus === "PAID",
        )
        .map((r) => r.eventId),
    ),
  };
}
