import "server-only";

import sharp from "sharp";
import { maxImageUploadBytes } from "@/lib/image-upload-limits";

const MAX_INPUT_BYTES = maxImageUploadBytes();
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 82;

/** Resize and compress large photos before storing them. */
export async function optimizeImage(
  input: Buffer,
  mimeType: string,
): Promise<{ buffer: Buffer; mimeType: string; size: number }> {
  if (input.length > MAX_INPUT_BYTES) {
    throw new Error(
      `Súbor je príliš veľký (max. ${Math.round(MAX_INPUT_BYTES / (1024 * 1024))} MB).`,
    );
  }

  if (mimeType === "image/gif") {
    return { buffer: input, mimeType, size: input.length };
  }

  const image = sharp(input, { failOn: "none" }).rotate();
  const meta = await image.metadata();
  const needsResize =
    (meta.width ?? 0) > MAX_DIMENSION || (meta.height ?? 0) > MAX_DIMENSION;

  let pipeline = needsResize
    ? image.resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: "inside",
        withoutEnlargement: true,
      })
    : image;

  if (mimeType === "image/png" && meta.hasAlpha) {
    const buffer = await pipeline.png({ compressionLevel: 9 }).toBuffer();
    return { buffer, mimeType: "image/png", size: buffer.length };
  }

  const buffer = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
  return { buffer, mimeType: "image/webp", size: buffer.length };
}
