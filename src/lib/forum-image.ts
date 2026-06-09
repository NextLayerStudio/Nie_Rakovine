import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 3 * 1024 * 1024;

export async function saveUploadedImage(
  file: File | null,
  folder: "forums" | "threads",
  prefix: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!file.type.startsWith("image/")) {
    throw new Error("Neplatný formát obrázka.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Obrázok je príliš veľký (max. 3 MB).");
  }

  const ext = file.type.includes("png")
    ? "png"
    : file.type.includes("webp")
      ? "webp"
      : "jpg";
  const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  await mkdir(uploadDir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  return `/uploads/${folder}/${filename}`;
}

/** @deprecated use saveUploadedImage */
export async function saveForumImage(file: File | null) {
  return saveUploadedImage(file, "forums", "forum");
}
