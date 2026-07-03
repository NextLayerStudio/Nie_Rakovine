import "server-only";

import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getTodayMoodEntry(userId: string) {
  return prisma.moodEntry.findFirst({
    where: { userId, createdAt: { gte: startOfToday() } },
    orderBy: { createdAt: "desc" },
  });
}

/** Contract spec: recommend contacting a professional when the recent trend is low. */
export async function getRecentMoodAverage(
  userId: string,
  days = 3,
): Promise<number | null> {
  const since = new Date(Date.now() - days * DAY_MS);
  const entries = await prisma.moodEntry.findMany({
    where: { userId, createdAt: { gte: since } },
    select: { score: true },
  });
  if (entries.length === 0) return null;
  return entries.reduce((sum, e) => sum + e.score, 0) / entries.length;
}

export async function getMonthMoodHistory(userId: string, days = 30) {
  const since = new Date(Date.now() - days * DAY_MS);
  return prisma.moodEntry.findMany({
    where: { userId, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
    select: { score: true, createdAt: true },
  });
}

/** Single round-trip for the home layout: popup gate + month history in one go. */
export async function getMoodPromptData(userId: string) {
  const [today, monthHistory] = await Promise.all([
    getTodayMoodEntry(userId),
    getMonthMoodHistory(userId),
  ]);
  return {
    hasLoggedToday: today !== null,
    monthHistory: monthHistory.map((e) => ({
      score: e.score,
      createdAt: e.createdAt.toISOString(),
    })),
  };
}
