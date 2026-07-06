import "server-only";

import { issueSignedToken, presignUrl } from "@vercel/blob";

/** Stored in Post.videoUrl for Blob-backed uploads, to disambiguate from external/legacy URLs. */
const BLOB_PREFIX = "blob:";

export function toBlobVideoUrl(pathname: string): string {
  return `${BLOB_PREFIX}${pathname}`;
}

/**
 * Resolves a stored video reference into something a <video> tag can actually
 * play. Blob-backed videos are private, so we mint a short-lived signed GET
 * URL on every render instead of storing a permanent public link. External
 * links (YouTube/Vimeo) and legacy `/api/media/...` references pass through
 * unchanged.
 */
export async function resolveVideoPlaybackUrl(
  videoUrl: string | null,
): Promise<string | null> {
  if (!videoUrl) return null;
  if (!videoUrl.startsWith(BLOB_PREFIX)) return videoUrl;

  const pathname = videoUrl.slice(BLOB_PREFIX.length);

  const token = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil: Date.now() + 2 * 60 * 60 * 1000,
  });

  const { presignedUrl } = await presignUrl(token, {
    operation: "get",
    pathname,
    access: "private",
  });

  return presignedUrl;
}
