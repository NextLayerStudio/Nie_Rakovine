import "server-only";

import { cache } from "react";
import type { Event, NotificationType, Post } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { distanceKm, hasCoords } from "@/lib/geo";

type NotifyInput = {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  href?: string | null;
  postId?: string | null;
  threadId?: string | null;
  commentId?: string | null;
  profileId?: string | null;
  eventId?: string | null;
};

export async function createNotification(input: NotifyInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      href: input.href ?? null,
      postId: input.postId ?? null,
      threadId: input.threadId ?? null,
      commentId: input.commentId ?? null,
      profileId: input.profileId ?? null,
      eventId: input.eventId ?? null,
    },
  });
}

export const getUnreadNotificationCount = cache(async (userId: string) => {
  return prisma.notification.count({
    where: { userId, read: false },
  });
});

export async function notifyProfileFollowersNewPost(
  post: Post & { profile: { id: string; displayName: string } | null },
) {
  if (!post.published || !post.profileId || !post.profile) return;

  const followers = await prisma.profileFollow.findMany({
    where: { profileId: post.profileId },
    select: { userId: true },
  });

  const href =
    post.type === "VIDEO"
      ? post.videoUrl ?? "/home"
      : post.type === "ARTICLE"
        ? `/home/articles/${post.id}`
        : `/home/recipes/${post.id}`;

  const typeLabel =
    post.type === "VIDEO" ? "video" : post.type === "RECIPE" ? "recept" : "článok";

  await prisma.notification.createMany({
    data: followers.map((f) => ({
      userId: f.userId,
      type: "NEW_POST" as const,
      title: `Nový ${typeLabel} od ${post.profile!.displayName}`,
      body: post.title,
      href,
      postId: post.id,
      profileId: post.profileId,
    })),
  });
}

export async function notifyForumThreadApproved(
  threadId: string,
  authorId: string,
  forumId: string,
  forumTitle: string,
) {
  await createNotification({
    userId: authorId,
    type: "FORUM_THREAD_APPROVED",
    title: "Správa vo fóre bola schválená",
    body: `Vaša správa vo fóre „${forumTitle}“ je teraz viditeľná pre ostatných.`,
    href: `/home/forums/${forumId}/${threadId}`,
    threadId,
  });
}

export async function notifyForumCommentApproved(
  commentId: string,
  threadId: string,
  authorId: string,
  forumId: string,
  forumTitle: string,
) {
  await createNotification({
    userId: authorId,
    type: "FORUM_COMMENT_APPROVED",
    title: "Komentár vo fóre bol schválený",
    body: `Váš komentár vo fóre „${forumTitle}“ je teraz viditeľný.`,
    href: `/home/forums/${forumId}/${threadId}`,
    commentId,
    threadId,
  });
}

/**
 * Notify users whose home location is within their chosen radius of a new event.
 * No-op if the event has no coordinates or isn't published.
 */
export async function notifyNearbyUsersNewEvent(event: Event) {
  if (!event.published || !hasCoords(event)) return;

  const profiles = await prisma.userProfile.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    select: { userId: true, latitude: true, longitude: true, notifyRadiusKm: true },
  });

  const recipients = profiles.filter((p) => {
    const d = distanceKm(p, event);
    return d !== null && d <= (p.notifyRadiusKm ?? 50);
  });

  if (recipients.length === 0) return;

  await prisma.notification.createMany({
    data: recipients.map((p) => ({
      userId: p.userId,
      type: "NEW_EVENT_NEARBY" as const,
      title: "Nová aktivita vo vašom okolí",
      body: event.location ? `${event.title} — ${event.location}` : event.title,
      href: `/home/events/${event.id}`,
      eventId: event.id,
    })),
  });
}

export function notificationTypeLabel(type: NotificationType): string {
  switch (type) {
    case "NEW_POST":
      return "Nový príspevok";
    case "FORUM_THREAD_APPROVED":
      return "Fórum";
    case "FORUM_COMMENT_APPROVED":
      return "Fórum";
    case "NEW_EVENT_NEARBY":
      return "Aktivita v okolí";
  }
}
