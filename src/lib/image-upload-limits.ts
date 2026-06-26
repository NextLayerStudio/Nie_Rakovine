/** Client-safe upload size limits (must match server image-processing.ts). */
export function maxImageUploadBytes() {
  return 20 * 1024 * 1024;
}

/**
 * Use on `<input type="file">` for images.
 * `image/*` opens the photo gallery on Samsung/Android; specific MIME lists often
 * force the document/file picker instead.
 */
export const IMAGE_FILE_INPUT_ACCEPT = "image/*";

const IMAGE_EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

/** Gallery picks on some Android devices omit MIME or send application/octet-stream. */
export function inferImageMimeType(file: File): string {
  if (file.type && file.type !== "application/octet-stream") {
    return file.type;
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXT_TO_MIME[ext] ?? file.type ?? "";
}

export function isLikelyImageFile(file: File): boolean {
  return inferImageMimeType(file).startsWith("image/");
}
