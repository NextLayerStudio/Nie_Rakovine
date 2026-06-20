"use server";

import type { PostType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireActionUser } from "@/lib/safe-action";
import { loadFeedEngagement } from "@/lib/feed-engagement";
import { feedPostSelect, LIST_POST_LIMIT } from "@/lib/feed-queries";
import type { LibraryKind, LibrarySort } from "@/lib/library";

const KIND_TO_TYPE: Record<Exclude<LibraryKind, "novinky">, PostType> = {
  audio: "AUDIO",
  clanky: "ARTICLE",
  video: "VIDEO",
};

export async function fetchLibraryAction(params: {
  kind: LibraryKind;
  query?: string;
  sort?: LibrarySort;
}) {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false as const };

  const q = (params.query ?? "").trim();
  const sortDir = params.sort === "oldest" ? ("asc" as const) : ("desc" as const);

  const searchFilter = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { excerpt: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(params.kind === "novinky"
        ? { isNovinka: true, ...searchFilter }
        : { type: KIND_TO_TYPE[params.kind], ...searchFilter }),
    },
    orderBy: [{ publishedAt: sortDir }, { createdAt: sortDir }],
    take: LIST_POST_LIMIT,
    select: feedPostSelect,
  });

  const postIds = posts.map((p) => p.id);
  const profileIds = [
    ...new Set(
      posts.map((p) => p.profileId).filter((id): id is string => !!id),
    ),
  ];

  const { likedIds, savedIds, followingIds } = await loadFeedEngagement(
    auth.user.id,
    postIds,
    profileIds,
    [],
  );

  return {
    ok: true as const,
    posts,
    likedPostIds: [...likedIds],
    savedPostIds: [...savedIds],
    followingProfileIds: [...followingIds],
    userName: auth.user.fullName,
  };
}
