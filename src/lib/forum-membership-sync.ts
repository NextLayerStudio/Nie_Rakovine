export const FORUM_MEMBERSHIP_EVENT = "onko-forum-membership";

export type ForumMembershipDetail = {
  forumId: string;
  following: boolean;
};

export function emitForumMembershipChange(forumId: string, following: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ForumMembershipDetail>(FORUM_MEMBERSHIP_EVENT, {
      detail: { forumId, following },
    }),
  );
}

export function applyForumMembershipChange<T extends {
  followingForumIds: string[];
  forums: Array<{ id: string; _count: { members: number } }>;
}>(data: T, forumId: string, following: boolean): T {
  const wasFollowing = data.followingForumIds.includes(forumId);
  if (wasFollowing === following) return data;

  const followingForumIds = following
    ? [...data.followingForumIds, forumId]
    : data.followingForumIds.filter((id) => id !== forumId);

  return {
    ...data,
    followingForumIds,
    forums: data.forums.map((forum) =>
      forum.id === forumId
        ? {
            ...forum,
            _count: {
              members: Math.max(0, forum._count.members + (following ? 1 : -1)),
            },
          }
        : forum,
    ),
  };
}
