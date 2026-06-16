import "server-only";

import { prisma } from "@/lib/prisma";

const IMAGE_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

const VIDEO_TYPES = new Map([
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["video/quicktime", ".mov"],
]);

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export type UploadFolder = "posts" | "events" | "profiles" | "forums" | "videos";

function mediaApiPath(id: string) {
  return `/api/media/${id}`;
}

async function saveUploadedFile(
  file: File,
  category: UploadFolder,
  allowedTypes: Map<string, string>,
  maxBytes: number,
): Promise<string> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Nebol vybraný žiadny súbor.");
  }

  if (!allowedTypes.has(file.type)) {
    throw new Error("Nepodporovaný formát súboru.");
  }

  if (file.size > maxBytes) {
    throw new Error(
      `Súbor je príliš veľký (max. ${Math.round(maxBytes / (1024 * 1024))} MB).`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const asset = await prisma.mediaAsset.create({
    data: {
      mimeType: file.type,
      filename: file.name || null,
      category,
      size: file.size,
      data: buffer,
    },
    select: { id: true },
  });

  return mediaApiPath(asset.id);
}

/** Save an uploaded image to the database and return its API URL. */
export async function saveUploadedImage(
  file: File,
  folder: UploadFolder,
): Promise<string> {
  return saveUploadedFile(file, folder, IMAGE_TYPES, MAX_IMAGE_BYTES);
}

/** Save an uploaded video to the database and return its API URL. */
export async function saveUploadedVideo(file: File): Promise<string> {
  return saveUploadedFile(file, "videos", VIDEO_TYPES, MAX_VIDEO_BYTES);
}

/**
 * Prefer a newly uploaded file; fall back to an explicit URL field.
 * Returns null when neither is provided.
 */
export async function resolveImageField(
  formData: FormData,
  fileField: string,
  urlField: string,
  folder: UploadFolder,
): Promise<string | null> {
  const file = formData.get(fileField);
  if (file instanceof File && file.size > 0) {
    return saveUploadedImage(file, folder);
  }

  const url = String(formData.get(urlField) ?? "").trim();
  return url || null;
}

/**
 * Prefer a newly uploaded video file; fall back to an explicit URL field.
 * When keepExisting is set and nothing new is provided, returns undefined
 * so callers can preserve the previous value.
 */
export async function resolveVideoField(
  formData: FormData,
  fileField: string,
  urlField: string,
  keepExisting?: string | null,
): Promise<string | null | undefined> {
  const file = formData.get(fileField);
  if (file instanceof File && file.size > 0) {
    return saveUploadedVideo(file);
  }

  const url = String(formData.get(urlField) ?? "").trim();
  if (url) return url;
  if (keepExisting !== undefined) return keepExisting ?? null;
  return null;
}

/** Upload all files from a multi-file form field. */
export async function saveUploadedImages(
  formData: FormData,
  fileField: string,
  folder: UploadFolder,
): Promise<string[]> {
  const entries = formData.getAll(fileField);
  const urls: string[] = [];

  for (const entry of entries) {
    if (entry instanceof File && entry.size > 0) {
      urls.push(await saveUploadedImage(entry, folder));
    }
  }

  return urls;
}

export function isStoredMediaUrl(url: string) {
  return url.startsWith("/api/media/");
}

export function isLegacyLocalUpload(url: string) {
  return url.startsWith("/uploads/");
}
