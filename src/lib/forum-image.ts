import { saveUploadedImage } from "@/lib/uploads";

/** Save a forum or thread image to the database (works on Vercel). */
export async function saveForumImage(
  file: File | null,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  return saveUploadedImage(file, "forums");
}

/** @deprecated use saveForumImage — kept for existing call sites. */
export async function saveUploadedImageLegacy(
  file: File | null,
  folder: "forums" | "threads",
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  return saveUploadedImage(file, "forums");
}
