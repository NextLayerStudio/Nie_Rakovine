import type { PostType } from "@prisma/client";

/** Public detail page for any post type. */
export function postPublicHref(post: { id: string }) {
  return `/home/posts/${post.id}`;
}

/** Ordered gallery: cover first, then extra images (no duplicates). */
export function buildPostGallery(
  coverUrl: string | null,
  images: { url: string }[] = [],
): string[] {
  const extra = images
    .map((img) => img.url)
    .filter((url) => url && url !== coverUrl);
  return [...(coverUrl ? [coverUrl] : []), ...extra];
}

export function postCoverFallback(type: PostType): string {
  switch (type) {
    case "VIDEO":
      return "linear-gradient(180deg, #f3c3a2 0%, #d98c80 100%)";
    case "ARTICLE":
      return "linear-gradient(180deg, #f5e0c8 0%, #d8a079 100%)";
    default:
      return "linear-gradient(180deg, #ffcdb2 0%, #e07a5f 100%)";
  }
}

export function postKindLabel(type: PostType) {
  switch (type) {
    case "VIDEO":
      return "Video";
    case "ARTICLE":
      return "Článok";
    case "RECIPE":
      return "Recept";
  }
}

export function isEmbeddableVideo(url: string) {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com")
  );
}

export function isLocalMedia(url: string) {
  return url.startsWith("/api/media/") || url.startsWith("/uploads/");
}
