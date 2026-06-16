/** Client-safe upload size limits (must match server image-processing.ts). */
export function maxImageUploadBytes() {
  return 20 * 1024 * 1024;
}
