import type { CancerType, ClubProfile } from "@prisma/client";
import type { FeedEventRow, FeedPostRow } from "@/lib/feed-queries";
import { relevanceScore } from "@/lib/cancer-personalization";

export type FeedPostItem = {
  kind: "post";
  sortAt: Date;
  post: FeedPostRow;
};

export type FeedEventItem = {
  kind: "event";
  sortAt: Date;
  event: FeedEventRow;
};

export type FeedItem = FeedPostItem | FeedEventItem;

export function buildHomeFeed(
  posts: FeedPostRow[],
  events: FeedEventRow[],
  userTypes: CancerType[] = [],
  displayLimit = 50,
): FeedItem[] {
  const items: FeedItem[] = [
    ...posts.map((post) => ({
      kind: "post" as const,
      sortAt: post.publishedAt ?? post.createdAt,
      post,
    })),
    ...events.map((event) => ({
      kind: "event" as const,
      sortAt: event.startsAt,
      event,
    })),
  ];

  const score = (item: FeedItem) =>
    relevanceScore(
      item.kind === "post" ? item.post.cancerTypes : item.event.cancerTypes,
      userTypes,
    );

  return items.sort((a, b) => {
    // Content matching the user's cancer type floats to the top.
    const byScore = score(b) - score(a);
    if (byScore !== 0) return byScore;
    return b.sortAt.getTime() - a.sortAt.getTime();
  }).slice(0, displayLimit);
}

export function defaultProfileLabel(
  profile: Pick<ClubProfile, "displayName" | "handle" | "avatarUrl"> | null,
): {
  displayName: string;
  handle: string;
  avatarUrl: string | null;
} {
  if (profile) {
    return {
      displayName: profile.displayName,
      handle: profile.handle,
      avatarUrl: profile.avatarUrl,
    };
  }
  return {
    displayName: "ONKO KLUB",
    handle: "onko-klub",
    avatarUrl: null,
  };
}
