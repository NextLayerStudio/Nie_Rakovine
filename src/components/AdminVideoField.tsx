"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  MAX_BLOB_VIDEO_BYTES,
  VIDEO_FILE_INPUT_ACCEPT,
  isLikelyVideoFile,
} from "@/lib/video-upload-limits";

const BLOB_PREFIX = "blob:";

function isUploadedVideo(url: string) {
  return url.startsWith("/api/media/") || url.startsWith("/uploads/videos/");
}

/** Uploads straight from the browser to Vercel Blob — the file never passes through our server. */
async function uploadVideoToBlob(
  file: File,
  onProgress: (percent: number) => void,
): Promise<string> {
  const result = await upload(file.name, file, {
    access: "private",
    handleUploadUrl: "/api/upload/video/blob",
    onUploadProgress: ({ percentage }) => onProgress(Math.round(percentage)),
  });
  return `${BLOB_PREFIX}${result.pathname}`;
}

/** Grabs a single frame from the video (client-side, no ffmpeg needed) to use as an automatic thumbnail. */
function captureVideoFrame(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const videoEl = document.createElement("video");
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.preload = "metadata";
    videoEl.src = objectUrl;

    let settled = false;
    const finish = (blob: Blob | null) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(objectUrl);
      resolve(blob);
    };

    const timeout = setTimeout(() => finish(null), 6000);

    videoEl.onloadedmetadata = () => {
      videoEl.currentTime = Math.min(1, (videoEl.duration || 1) / 2);
    };
    videoEl.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoEl.videoWidth || 640;
        canvas.height = videoEl.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          finish(null);
          return;
        }
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            clearTimeout(timeout);
            finish(blob);
          },
          "image/jpeg",
          0.85,
        );
      } catch {
        finish(null);
      }
    };
    videoEl.onerror = () => finish(null);
  });
}

async function uploadThumbnail(blob: Blob): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", new File([blob], "video-thumb.jpg", { type: "image/jpeg" }));
  try {
    const res = await fetch("/api/upload/image", { method: "POST", body: fd });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  } catch {
    return null;
  }
}

const MAX_GB = Math.round((MAX_BLOB_VIDEO_BYTES / (1024 * 1024 * 1024)) * 10) / 10;

/** Admin video field — direct-to-Blob upload (works for multi-GB files), paste-a-link fallback, live preview. */
export function AdminVideoField({
  defaultValue = "",
  previewSignedUrl,
}: {
  defaultValue?: string;
  /** Freshly signed, playable URL for an existing Blob-backed video (defaultValue holds the stable `blob:pathname` instead). */
  previewSignedUrl?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | null>(null);

  const [url, setUrl] = useState(defaultValue);
  const [autoThumbnailUrl, setAutoThumbnailUrl] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function startUpload(file: File) {
    pendingFileRef.current = file;
    setFileName(file.name);
    setFilePreview(URL.createObjectURL(file));
    setUrl("");
    setAutoThumbnailUrl("");
    setStatus("uploading");
    setProgress(0);
    setError(null);

    captureVideoFrame(file).then((blob) => {
      if (!blob) return;
      uploadThumbnail(blob).then((thumbUrl) => {
        if (thumbUrl) setAutoThumbnailUrl(thumbUrl);
      });
    });

    try {
      const uploadedUrl = await uploadVideoToBlob(file, setProgress);
      setUrl(uploadedUrl);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Nahrávanie videa zlyhalo.");
    }
  }

  function onFileChange(file: File | undefined) {
    if (!file) return;
    if (!isLikelyVideoFile(file)) {
      setError("Nepodporovaný formát. Použite MP4, WebM alebo MOV.");
      setStatus("error");
      return;
    }
    if (file.size > MAX_BLOB_VIDEO_BYTES) {
      setError(`Video je príliš veľké (max. ${MAX_GB} GB).`);
      setStatus("error");
      return;
    }
    void startUpload(file);
  }

  function retry() {
    if (pendingFileRef.current) void startUpload(pendingFileRef.current);
  }

  // A `blob:` reference isn't directly fetchable (private store) — show the
  // freshly signed preview URL the server computed for it instead.
  const storedPreviewUrl = url.startsWith(BLOB_PREFIX) ? previewSignedUrl ?? null : url.trim() || null;
  const previewUrl = filePreview || storedPreviewUrl;
  const showNativePreview =
    previewUrl &&
    (isUploadedVideo(previewUrl) ||
      previewUrl.startsWith("/api/media/") ||
      previewUrl.startsWith("/uploads/") ||
      previewUrl.includes(".blob.vercel-storage.com") ||
      filePreview);

  return (
    <div className="block">
      <span className="admin-label">Video</span>
      <p className="mb-3 text-[11px] text-brand-purple/55">
        Nahrajte video zo počítača alebo vložte odkaz (YouTube, Vimeo…).
        Použite pri type „Video“.
      </p>

      {previewUrl && (
        <div className="mb-4 overflow-hidden rounded-xl border border-brand-purple/10 bg-black/5">
          {showNativePreview && !previewUrl.includes("youtube") && !previewUrl.includes("youtu.be") && !previewUrl.includes("vimeo") ? (
            <video
              src={previewUrl}
              controls
              className="max-h-48 w-full bg-black"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center bg-brand-purple/5 px-4 text-center text-xs text-brand-purple/60">
              Náhľad: {previewUrl}
            </div>
          )}
        </div>
      )}

      {status === "uploading" && (
        <div className="mb-3">
          <div className="h-2 overflow-hidden rounded-full bg-brand-purple/10">
            <div
              className="h-full rounded-full bg-brand-purple transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-brand-purple/60">
            Nahrávam video… {progress}%
          </p>
        </div>
      )}

      {status === "done" && (
        <p className="mb-3 text-[11px] font-semibold text-emerald-600">
          Video nahraté ✓
        </p>
      )}

      {status === "error" && error && (
        <div className="mb-3 flex items-center justify-between gap-2 rounded-lg bg-red-50 px-3 py-2">
          <p className="text-[11px] text-red-600">{error}</p>
          {pendingFileRef.current && (
            <button
              type="button"
              onClick={retry}
              className="shrink-0 text-[11px] font-semibold text-red-700 underline"
            >
              Skúsiť znova
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <input
            ref={fileRef}
            type="file"
            accept={VIDEO_FILE_INPUT_ACCEPT}
            className="sr-only"
            onChange={(e) => {
              onFileChange(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={status === "uploading"}
            className="admin-btn-outline w-full disabled:opacity-50 sm:w-auto"
          >
            Nahrať video zo počítača
          </button>
          {fileName && (
            <p className="mt-1.5 truncate text-xs text-brand-purple/60">
              {fileName}
            </p>
          )}
          <p className="mt-1 text-[11px] text-brand-purple/50">
            MP4, WebM alebo MOV · max. {MAX_GB} GB
          </p>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-medium text-brand-purple/55">
            alebo vložte odkaz
          </p>
          <input
            type="text"
            inputMode="url"
            value={url.startsWith(BLOB_PREFIX) ? "" : url}
            onChange={(e) => {
              setUrl(e.target.value);
              setFileName(null);
              setFilePreview(null);
              setStatus("idle");
              setError(null);
              pendingFileRef.current = null;
            }}
            placeholder={url.startsWith(BLOB_PREFIX) ? "Video už je nahraté — sem vložte odkaz len ak ho chcete nahradiť" : "https://…"}
            className="admin-input"
          />
        </div>
      </div>

      <input type="hidden" name="videoUrl" value={url} readOnly />
      <input type="hidden" name="videoAutoThumbnailUrl" value={autoThumbnailUrl} readOnly />
    </div>
  );
}
