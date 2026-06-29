import type { PostType } from "@prisma/client";

export type ClubProfilePostCategory = "all" | PostType;

export const CLUB_PROFILE_POST_TYPES: PostType[] = [
  "VIDEO",
  "ARTICLE",
  "RECIPE",
  "PHOTO",
  "AUDIO",
  "NEWS",
];

export function parseClubProfilePostCategory(
  value: string | null | undefined,
): ClubProfilePostCategory {
  if (!value || value === "all") return "all";
  return CLUB_PROFILE_POST_TYPES.includes(value as PostType)
    ? (value as PostType)
    : "all";
}

export function clubProfileCategoriesWithPosts(
  posts: { type: PostType }[],
): PostType[] {
  const types = new Set(posts.map((p) => p.type));
  return CLUB_PROFILE_POST_TYPES.filter((t) => types.has(t));
}
