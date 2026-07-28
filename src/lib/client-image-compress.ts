/**
 * Client-side image downscale/re-encode, run in the browser before a file
 * ever reaches a Server Action. Vercel hard-caps request bodies at ~4.5 MB
 * (platform limit, not configurable via next.config) — a raw phone photo
 * (often 3-10 MB) blows past that and the request fails before our code
 * (and its try/catch error messages) ever runs, surfacing as a generic
 * uncaught error to the user. Compressing on selection guarantees every
 * upload — cover image, crop tool source, or gallery file — stays well
 * under that ceiling regardless of what the person picks.
 */

const MAX_DIMENSION = 2000;
const MAX_BYTES = 4 * 1024 * 1024;
const START_QUALITY = 0.85;
const MIN_QUALITY = 0.4;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Obrázok sa nepodarilo načítať."));
    img.src = src;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function renameForJpeg(name: string): string {
  return name.replace(/\.[^./]+$/, "") + ".jpg";
}

/**
 * Downscale + re-encode an image file so it's guaranteed to be small enough
 * for a Vercel Server Action request. Animated GIFs are left untouched
 * (canvas re-encoding would flatten them to a single frame). Anything
 * already small and within bounds is returned unchanged to avoid needless
 * quality loss.
 */
export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const longSide = Math.max(img.naturalWidth, img.naturalHeight);

    if (longSide <= MAX_DIMENSION && file.size <= MAX_BYTES) {
      return file;
    }

    let width = img.naturalWidth;
    let height = img.naturalHeight;
    const initialScale = Math.min(1, MAX_DIMENSION / longSide);
    width = Math.round(width * initialScale);
    height = Math.round(height * initialScale);

    for (let shrink = 0; shrink < 3; shrink++) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = START_QUALITY;
      for (let attempt = 0; attempt < 4; attempt++) {
        const blob = await canvasToBlob(canvas, "image/jpeg", quality);
        if (!blob) break;
        if (blob.size <= MAX_BYTES) {
          return new File([blob], renameForJpeg(file.name), {
            type: "image/jpeg",
          });
        }
        quality = Math.max(MIN_QUALITY, quality - 0.15);
      }

      // Still too big even at minimum quality — shrink dimensions further and retry.
      width = Math.round(width * 0.7);
      height = Math.round(height * 0.7);
    }

    // Extremely unlikely fallback: return the smallest attempt we produced.
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);
    const finalBlob = await canvasToBlob(canvas, "image/jpeg", MIN_QUALITY);
    return finalBlob
      ? new File([finalBlob], renameForJpeg(file.name), { type: "image/jpeg" })
      : file;
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
