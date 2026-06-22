import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

/** Shared pending-moderation counts (deduped between admin layout + dashboard). */
export const getPendingModerationCounts = cache(async () => {
  const pendingThreads = await prisma.forumThread.count({
    where: { status: "PENDING" },
  });
  return { pendingThreads, total: pendingThreads };
});
