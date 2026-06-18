import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

/** Shared pending-moderation counts (deduped between admin layout + dashboard). */
export const getPendingModerationCounts = cache(async () => {
  const [pendingForums, pendingThreads] = await Promise.all([
    prisma.forum.count({
      where: { published: false, createdById: { not: null } },
    }),
    prisma.forumThread.count({ where: { status: "PENDING" } }),
  ]);
  return { pendingForums, pendingThreads, total: pendingForums + pendingThreads };
});
