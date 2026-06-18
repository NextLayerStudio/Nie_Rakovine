import "server-only";

import { maxImageUploadBytes } from "@/lib/image-upload-limits";

const MAX_INPUT_BYTES = maxImageUploadBytes();
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 82;

type SharpModule = typeof import("sharp").default;

async function loadSharp(): Promise<SharpModule | null> {
  try {
    const mod = await import("sharp");
    return mod.default;
  } catch (err) {
    console.warn("[optimizeImage] sharp unavailable, using original file:", err);
    return null;
  }
}

function passthrough(
  input: Buffer,
  mimeType: string,
): { buffer: Buffer; mimeType: string; size: number } {
  return { buffer: input, mimeType, size: input.length };
}

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
    return passthrough(input, mimeType);
  }

  const sharp = await loadSharp();
  if (!sharp) {
    return passthrough(input, mimeType);
  }

  try {
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
  } catch (err) {
    console.warn("[optimizeImage] sharp processing failed, using original:", err);
    return passthrough(input, mimeType);
  }
}
