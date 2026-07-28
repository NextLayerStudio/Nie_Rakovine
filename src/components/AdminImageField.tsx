"use client";

import { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { IMAGE_FILE_INPUT_ACCEPT } from "@/lib/image-upload-limits";
import { compressImageFile } from "@/lib/client-image-compress";

async function getCroppedFile(imageSrc: string, pixelCrop: Area, fileName: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        img,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(new File([blob], fileName.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
          else reject(new Error("Canvas prázdny"));
        },
        "image/jpeg",
        0.92,
      );
    };
    img.src = imageSrc;
  });
}

/** Admin image field — upload a file or paste a URL, with live preview and crop editor. */
export function AdminImageField({
  name,
  uploadName,
  label,
  hint,
  defaultValue = "",
  shape = "circle",
  previewAspect = "square",
  mandatoryAspect = false,
}: {
  name: string;
  uploadName?: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  /** "square" = same 1:1 crop as "circle" but with a rectangular (not round) crop mask and preview - for avatars displayed as rounded squares, not circles. */
  shape?: "circle" | "rounded" | "square";
  previewAspect?: "square" | "video";
  /** When set with previewAspect="video", forces every upload through a mandatory 16:9 crop (no orientation choice). */
  mandatoryAspect?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  // The freshly selected local file's object URL — only set for a real file pick (not a pasted
  // URL or an already-saved image), so "Orezať fotku" always has a same-origin blob to crop.
  const [localFileSrc, setLocalFileSrc] = useState<string | null>(null);

  // Crop modal state
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOrigName, setCropOrigName] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  // "original" follows the source photo's own shape (no forced ratio); the other two are manual overrides.
  const [cropOrientation, setCropOrientation] = useState<"original" | "landscape" | "portrait">("original");
  const [naturalAspect, setNaturalAspect] = useState<number | null>(null);

  const cropAspect =
    previewAspect !== "video"
      ? 1
      : mandatoryAspect
        ? 16 / 9
        : cropOrientation === "landscape"
          ? 16 / 9
          : cropOrientation === "portrait"
            ? 9 / 16
            : (naturalAspect ?? 16 / 9);
  const cropShape: "round" | "rect" = shape === "circle" ? "round" : "rect";

  const previewClass =
    shape === "circle"
      ? "h-20 w-20 rounded-full"
      : shape === "square"
        ? "h-20 w-20 rounded-xl"
        : previewAspect === "video"
          ? cropAspect < 1
            ? "h-40 w-24 rounded-xl"
            : "h-24 w-40 rounded-xl"
          : "h-20 w-32 rounded-xl";

  const previewSrc = filePreview || url.trim() || null;
  const previewStyle = previewSrc
    ? { backgroundImage: `url(${previewSrc})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : { background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)" };

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function onFileChange(file: File | undefined) {
    if (!file) { setFilePreview(null); setFileName(null); setLocalFileSrc(null); return; }

    // Always compress+downscale on selection, before anything else touches the
    // file — this guarantees the real <input> never holds a raw, oversized
    // phone photo, even if the person cancels the crop tool below.
    const compressed = await compressImageFile(file);
    if (fileRef.current) {
      const dt = new DataTransfer();
      dt.items.add(compressed);
      fileRef.current.files = dt.files;
    }

    const objectUrl = URL.createObjectURL(compressed);
    setNaturalAspect(null);
    const probe = new Image();
    probe.onload = () => setNaturalAspect(probe.naturalWidth / probe.naturalHeight);
    probe.src = objectUrl;

    setLocalFileSrc(objectUrl);
    setCropOrigName(compressed.name);

    if (previewAspect === "video" && !mandatoryAspect) {
      // Cover photos behave exactly like gallery uploads by default — no forced
      // crop. The (already compressed) file sits in the real <input>, so
      // nothing else to do besides updating the preview; cropping is
      // available on demand below.
      setFilePreview(objectUrl);
      setFileName(compressed.name);
      return;
    }

    // Square/circle avatars, and covers with a mandatory aspect, go straight into the crop tool.
    setCropSrc(objectUrl);
    setCropOrientation(mandatoryAspect ? "landscape" : "original");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  function openCropTool() {
    if (!localFileSrc) return;
    setCropSrc(localFileSrc);
    setCropOrientation(mandatoryAspect ? "landscape" : "original");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  function setOrientation(next: "original" | "landscape" | "portrait") {
    setCropOrientation(next);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  async function confirmCrop() {
    if (!cropSrc || !croppedAreaPixels) return;
    try {
      const croppedFile = await getCroppedFile(cropSrc, croppedAreaPixels, cropOrigName);
      const previewUrl = URL.createObjectURL(croppedFile);
      setFilePreview(previewUrl);
      setFileName(croppedFile.name);
      // Inject cropped file back into the hidden file input so the form picks it up
      if (fileRef.current) {
        const dt = new DataTransfer();
        dt.items.add(croppedFile);
        fileRef.current.files = dt.files;
      }
    } catch (err) {
      console.error("Crop zlyhal:", err);
    }
    setCropSrc(null);
  }

  return (
    <>
      <div className="block">
        <span className="admin-label">{label}</span>
        {hint && <p className="mb-2 text-[11px] text-brand-purple/55">{hint}</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div
            aria-hidden
            className={`shrink-0 border border-brand-purple/10 ${previewClass}`}
            style={previewStyle}
          />

          <div className="min-w-0 flex-1 space-y-3">
            {uploadName && (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  name={uploadName}
                  accept={IMAGE_FILE_INPUT_ACCEPT}
                  className="sr-only"
                  onChange={(e) => onFileChange(e.target.files?.[0])}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="admin-btn-outline w-full sm:w-auto"
                  >
                    Vybrať obrázok z počítača
                  </button>
                  {previewAspect === "video" && localFileSrc && (
                    <button
                      type="button"
                      onClick={openCropTool}
                      className="admin-btn-outline w-full sm:w-auto"
                    >
                      Orezať fotku
                    </button>
                  )}
                </div>
                {fileName && (
                  <p className="mt-1.5 truncate text-xs text-brand-purple/60">{fileName}</p>
                )}
                <p className="mt-1 text-[11px] text-brand-purple/50">
                  JPG, PNG, WebP alebo GIF · do 20 MB · automaticky zmenšené
                </p>
              </div>
            )}

            <div>
              {uploadName && (
                <p className="mb-1 text-[11px] font-medium text-brand-purple/55">alebo vložte odkaz</p>
              )}
              <input
                name={name}
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className="admin-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Crop modal */}
      {cropSrc && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white" onClick={(e) => e.stopPropagation()}>
          {/* Crop area */}
          <div className="relative flex-1" style={{ background: "#f5f5f5" }}>
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              minZoom={0.3}
              maxZoom={4}
              aspect={cropAspect}
              cropShape={cropShape}
              showGrid={false}
              restrictPosition={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{ containerStyle: { background: "#f5f5f5" } }}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 border-t border-brand-purple/10 bg-white px-6 py-5">
            {previewAspect === "video" && !mandatoryAspect && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation("original")}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    cropOrientation === "original"
                      ? "bg-brand-purple text-white"
                      : "border border-brand-purple/20 text-brand-purple/60 hover:bg-brand-purple/5"
                  }`}
                >
                  Pôvodný pomer
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation("landscape")}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    cropOrientation === "landscape"
                      ? "bg-brand-purple text-white"
                      : "border border-brand-purple/20 text-brand-purple/60 hover:bg-brand-purple/5"
                  }`}
                >
                  Na šírku
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation("portrait")}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    cropOrientation === "portrait"
                      ? "bg-brand-purple text-white"
                      : "border border-brand-purple/20 text-brand-purple/60 hover:bg-brand-purple/5"
                  }`}
                >
                  Na výšku
                </button>
              </div>
            )}
            <div className="flex w-full max-w-xs items-center gap-3">
              <span className="text-xs text-brand-purple/40 w-10 text-right">−</span>
              <input
                type="range"
                min={0.3}
                max={4}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-[#FDA4C7]"
              />
              <span className="text-xs text-brand-purple/40 w-10">+</span>
            </div>
            <p className="text-xs text-brand-purple/40">Ťahaj obrázok, zoomuj posuvníkom</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCropSrc(null)}
                className="rounded-full border border-brand-purple/20 px-6 py-2.5 text-sm font-semibold text-brand-purple/60 hover:bg-brand-purple/5"
              >
                Zrušiť
              </button>
              <button
                type="button"
                onClick={confirmCrop}
                className="rounded-full bg-[#FDA4C7] px-8 py-2.5 text-sm font-bold text-white hover:brightness-110"
              >
                Použiť
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
