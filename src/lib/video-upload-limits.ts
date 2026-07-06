/** Client-safe constants for the Vercel Blob video upload flow (see /api/upload/video/blob). */

/** Must match MAX_BLOB_VIDEO_BYTES in src/lib/uploads.ts. */
export const MAX_BLOB_VIDEO_BYTES = 5 * 1024 * 1024 * 1024;

export const VIDEO_FILE_INPUT_ACCEPT = "video/mp4,video/webm,video/quicktime";

const VIDEO_MIME_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export function isLikelyVideoFile(file: File): boolean {
  if (file.type) return VIDEO_MIME_TYPES.has(file.type);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return ["mp4", "webm", "mov"].includes(ext);
}
