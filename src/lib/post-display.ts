import type { PostType } from "@prisma/client";

/** Public detail page for any post type. */
export function postPublicHref(post: { id: string }) {
  return `/home/posts/${post.id}`;
}

/** Discount partner profile page. */
export function discountPartnerHref(handle: string) {
  return `/home/zlavy/${handle}`;
}

/** A single discount card view (image-only) under a partner. */
export function discountCardHref(handle: string, offerId: string) {
  return `/home/zlavy/${handle}/karta/${offerId}`;
}

/**
 * Where a feed post should navigate when clicked. Discount-partner posts
 * ("reklama") link to their attached card (or the partner page as a fallback).
 */
export function feedPostHref(post: {
  id: string;
  linkedOfferId?: string | null;
  discountPartner?: { handle: string } | null;
}): string {
  if (post.discountPartner) {
    if (post.linkedOfferId) {
      return discountCardHref(post.discountPartner.handle, post.linkedOfferId);
    }
    return discountPartnerHref(post.discountPartner.handle);
  }
  return postPublicHref(post);
}

/** Return path for Onko knižnica (preserves active category tab). */
export function libraryReturnPath(kind: string) {
  return `/home/kniznica?kind=${kind}`;
}

/** Post detail URL that remembers where to go back (e.g. knižnica tab). */
export function postHrefWithReturn(postId: string, returnPath: string) {
  return `/home/posts/${postId}?from=${encodeURIComponent(returnPath)}`;
}

/** Club profile URL that remembers where to go back (e.g. search tab). */
export function profileHrefWithReturn(handle: string, returnPath: string) {
  return `/home/profiles/${handle}?from=${encodeURIComponent(returnPath)}`;
}

/** Forum page URL that remembers where to go back (e.g. Moj profil). */
export function forumHrefWithReturn(forumId: string, returnPath: string) {
  return `/home/forums/${forumId}?from=${encodeURIComponent(returnPath)}`;
}

/** Forum thread URL that remembers where to go back (e.g. Moj profil). */
export function forumThreadHrefWithReturn(
  forumId: string,
  threadId: string,
  returnPath: string,
) {
  return `/home/forums/${forumId}/${threadId}?from=${encodeURIComponent(returnPath)}`;
}

/** Only allow in-app relative return paths under /home or /profile. */
export function safeReturnHref(from: string | undefined, fallback: string): string {
  if (!from) return fallback;
  try {
    const path = decodeURIComponent(from);
    if (path.includes("://")) return fallback;
    const pathname = path.split("?")[0];
    if (
      pathname === "/home" ||
      pathname.startsWith("/home/") ||
      pathname === "/profile"
    ) {
      return path;
    }
  } catch {
    // invalid encoding
  }
  return fallback;
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
    case "NEWS":
      return "linear-gradient(180deg, #f6d8c9 0%, #c97b8c 100%)";
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
    case "NEWS": return "Novinka";
  }
}

/** Human-readable media length, e.g. 930 → "16 min", 45 → "1 min". */
export function formatDuration(durationSec: number | null | undefined): string | null {
  if (!durationSec || durationSec <= 0) return null;
  const minutes = Math.max(1, Math.round(durationSec / 60));
  return `${minutes} min`;
}

/** Short date for content cards, e.g. "25.5.2026". */
export function formatPostDate(date: Date | string): string {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(date));
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
