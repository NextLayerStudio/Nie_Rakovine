"use server";

import { prisma } from "@/lib/prisma";
import { requireActionUser } from "@/lib/safe-action";

export async function fetchForumSearchHintsAction(query: string) {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false as const, hints: [] };

  const q = query.trim();
  if (q.length < 1) return { ok: true as const, hints: [] };

  const forums = await prisma.forum.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { title: "asc" },
    take: 8,
    select: {
      id: true,
      title: true,
      imageUrl: true,
      accentColor: true,
      _count: { select: { members: true } },
    },
  });

  return {
    ok: true as const,
    hints: forums.map((f) => ({
      id: f.id,
      title: f.title,
      imageUrl: f.imageUrl,
      accentColor: f.accentColor,
      memberCount: f._count.members,
    })),
  };
}
