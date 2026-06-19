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
    case "PHOTO":
      return "linear-gradient(180deg, #e0d4f5 0%, #9b72cf 100%)";
    case "AUDIO":
      return "linear-gradient(180deg, #c8e6f5 0%, #5b9bd5 100%)";
    default:
      return "linear-gradient(180deg, #ffcdb2 0%, #e07a5f 100%)";
  }
}

export function postKindLabel(type: PostType) {
  switch (type) {
    case "VIDEO": return "Video";
    case "ARTICLE": return "Článok";
    case "RECIPE": return "Recept";
    case "PHOTO": return "Fotka";
    case "AUDIO": return "Audio";
  }
}

export function isEmbeddableVideo(url: string) {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com")
  );
}

/** Converts a YouTube/Vimeo watch URL into an embeddable iframe src. */
export function extractVideoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);

    // youtube.com/watch?v=ID
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      const id = u.searchParams.get("v")!;
      return `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
    }
    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
    }
    // vimeo.com/ID
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1&playsinline=1`;
    }
    // Already an embed URL — return as-is
    if (url.includes("/embed/") || url.includes("player.vimeo.com")) return url;
  } catch {
    // invalid URL
  }
  return null;
}

export function isLocalMedia(url: string) {
  return url.startsWith("/api/media/") || url.startsWith("/uploads/");
}
