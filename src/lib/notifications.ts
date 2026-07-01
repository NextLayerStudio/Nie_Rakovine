import "server-only";

import { cache } from "react";
import type { Event, NotificationType, Post } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { postPublicHref, postKindLabel } from "@/lib/post-display";
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

type NotificationPrefs = {
  notifyNewPosts: boolean;
  notifyForumApproved: boolean;
  notifyForumReactions: boolean;
  notifyEventsNearby: boolean;
};

const DEFAULT_PREFS: NotificationPrefs = {
  notifyNewPosts: true,
  notifyForumApproved: true,
  notifyForumReactions: true,
  notifyEventsNearby: true,
};

/** Read boolean prefs from profile row (safe when Prisma client lags schema). */
function prefsFromProfile(profile: Record<string, unknown>): NotificationPrefs {
  return {
    notifyNewPosts: profile.notifyNewPosts !== false,
    notifyForumApproved: profile.notifyForumApproved !== false,
    notifyForumReactions: profile.notifyForumReactions !== false,
    notifyEventsNearby: profile.notifyEventsNearby !== false,
  };
}

export async function createNotification(input: NotifyInput) {
  const allowed = await userAllowsNotification(input.userId, input.type);
  if (!allowed) return null;

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

async function loadNotificationPrefs(
  userId: string,
): Promise<NotificationPrefs> {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) return DEFAULT_PREFS;
  return prefsFromProfile(profile as unknown as Record<string, unknown>);
}

async function userAllowsNotification(
  userId: string,
  type: NotificationType | string,
): Promise<boolean> {
  const prefs = await loadNotificationPrefs(userId);

  switch (type) {
    case "NEW_POST":
      return prefs.notifyNewPosts;
    case "FORUM_THREAD_APPROVED":
      return prefs.notifyForumApproved;
    case "FORUM_COMMENT_APPROVED":
      return true;
    case "FORUM_REACTION":
      return prefs.notifyForumReactions;
    case "NEW_EVENT_NEARBY":
      return prefs.notifyEventsNearby;
    default:
      return true;
  }
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

  // Notifications are a best-effort side effect: never let a failure here abort
  // the save (which already committed) or blank the admin screen.
  try {
    const followers = await prisma.profileFollow.findMany({
      where: { profileId: post.profileId },
      select: { userId: true },
    });
    if (followers.length === 0) return;

    const profiles = await prisma.userProfile.findMany({
      where: { userId: { in: followers.map((f) => f.userId) } },
    });

    const prefsByUser = new Map(
      profiles.map((p) => [
        p.userId,
        prefsFromProfile(p as unknown as Record<string, unknown>).notifyNewPosts,
      ]),
    );

    const eligible = followers.filter((f) => prefsByUser.get(f.userId) !== false);
    if (eligible.length === 0) return;

    const href = postPublicHref(post);
    const typeLabel = postKindLabel(post.type).toLowerCase();

    await prisma.notification.createMany({
      data: eligible.map((f) => ({
        userId: f.userId,
        type: "NEW_POST" as const,
        title: `Nový ${typeLabel} od ${post.profile!.displayName}`,
        body: post.title,
        href,
        postId: post.id,
        profileId: post.profileId,
      })),
    });
  } catch (err) {
    console.error("[notifyProfileFollowersNewPost]", err);
  }
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

export async function notifyForumReaction(options: {
  authorId: string;
  reactorId: string;
  reactorName: string;
  forumId: string;
  forumTitle: string;
  threadId: string;
  commentId?: string | null;
  reactionText?: string | null;
}) {
  if (options.authorId === options.reactorId) return;

  const preview = options.reactionText?.trim();
  const truncated =
    preview && preview.length > 80 ? `${preview.slice(0, 77)}…` : preview;

  await createNotification({
    userId: options.authorId,
    type: "FORUM_REACTION" as NotificationType,
    title: "Reakcia na vašu správu",
    body: truncated
      ? `${options.reactorName} reagoval na vašu správu: „${truncated}“`
      : `${options.reactorName} reagoval na vašu správu vo fóre „${options.forumTitle}“.`,
    href: `/home/forums/${options.forumId}/${options.threadId}`,
    threadId: options.threadId,
    commentId: options.commentId ?? null,
  });
}

/**
 * Notify users whose home location is within their chosen radius of a new event.
 * No-op if the event has no coordinates or isn't published.
 */
export async function notifyNearbyUsersNewEvent(event: Event) {
  if (!event.published || !hasCoords(event)) return;

  // Best-effort side effect: never let a failure abort the save or blank the screen.
  try {
    const profiles = await prisma.userProfile.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        userId: true,
        latitude: true,
        longitude: true,
        notifyRadiusKm: true,
      },
    });

    const recipients = profiles.filter((p) => {
      const prefs = prefsFromProfile(p as unknown as Record<string, unknown>);
      if (!prefs.notifyEventsNearby) return false;
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
  } catch (err) {
    console.error("[notifyNearbyUsersNewEvent]", err);
  }
}

export function notificationTypeLabel(type: NotificationType | string): string {
  switch (type) {
    case "NEW_POST":
      return "Nový príspevok";
    case "FORUM_THREAD_APPROVED":
      return "Schválenie príspevku vo fóre";
    case "FORUM_COMMENT_APPROVED":
      return "Fórum";
    case "FORUM_REACTION":
      return "Reakcia vo fóre";
    case "NEW_EVENT_NEARBY":
      return "Aktivita v okolí";
    default:
      return "Oznámenie";
  }
}
