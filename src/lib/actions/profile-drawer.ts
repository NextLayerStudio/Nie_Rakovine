"use server";

import { prisma } from "@/lib/prisma";
import { requireActionUser } from "@/lib/safe-action";

export async function fetchProfileDrawerAction(profileId: string) {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false as const };

  const [profile, postCount, followerCount, followRow, recentPosts] =
    await Promise.all([
      prisma.clubProfile.findUnique({
        where: { id: profileId },
        select: {
          id: true,
          handle: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          coverUrl: true,
        },
      }),
      prisma.post.count({ where: { profileId, published: true } }),
      prisma.profileFollow.count({ where: { profileId } }),
      prisma.profileFollow.findUnique({
        where: { userId_profileId: { userId: auth.user.id, profileId } },
      }),
      prisma.post.findMany({
        where: { profileId, published: true },
        orderBy: { publishedAt: "desc" },
        take: 6,
        select: { id: true, coverUrl: true, type: true, title: true },
      }),
    ]);

  if (!profile) return { ok: false as const };

  return {
    ok: true as const,
    profile,
    postCount,
    followerCount,
    isFollowing: !!followRow,
    recentPosts,
  };
}
