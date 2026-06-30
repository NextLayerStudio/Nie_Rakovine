import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/** Pending moderation count — cached 30 s across requests, revalidated when admin acts. */
export const getPendingModerationCounts = unstable_cache(
  async () => {
    const pendingThreads = await prisma.forumThread.count({
      where: { status: "PENDING" },
    });
    return { pendingThreads, total: pendingThreads };
  },
  ["pending-moderation-counts"],
  { revalidate: 30, tags: ["pending-moderation"] },
);
