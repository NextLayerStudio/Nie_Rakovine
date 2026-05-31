import type { ForumModerationStatus } from "@prisma/client";

export const APPROVED: ForumModerationStatus = "APPROVED";

/** Threads visible in list (approved + own pending) */
export function visibleThreadsWhere(userId: string) {
  return {
    OR: [
      { status: APPROVED },
      { status: "PENDING" as const, authorId: userId },
    ],
  };
}

/** Comments visible on a thread */
export function visibleCommentsWhere(userId: string) {
  return {
    OR: [
      { status: APPROVED },
      { status: "PENDING" as const, authorId: userId },
    ],
  };
}

export function approvedCommentsCountWhere() {
  return { where: { status: APPROVED } };
}
