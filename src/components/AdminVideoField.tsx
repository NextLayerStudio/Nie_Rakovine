"use client";

import { useRef, useState } from "react";

function isUploadedVideo(url: string) {
  return url.startsWith("/api/media/") || url.startsWith("/uploads/videos/");
}

/** Admin video field — upload a file or paste a URL, with preview. */
export function AdminVideoField({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  function onFileChange(file: File | undefined) {
    if (!file) {
      setFileName(null);
      setFilePreview(null);
      return;
    }
    setFileName(file.name);
    setFilePreview(URL.createObjectURL(file));
    setUrl("");
  }

  const previewUrl = filePreview || url.trim() || null;
  const showNativePreview =
    previewUrl &&
    (isUploadedVideo(previewUrl) ||
      previewUrl.startsWith("/api/media/") ||
      previewUrl.startsWith("/uploads/") ||
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

      <div className="space-y-3">
        <div>
          <input
            ref={fileRef}
            type="file"
            name="videoFile"
            accept="video/mp4,video/webm,video/quicktime"
            className="sr-only"
            onChange={(e) => onFileChange(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="admin-btn-outline w-full sm:w-auto"
          >
            Nahrať video zo počítača
          </button>
          {fileName && (
            <p className="mt-1.5 truncate text-xs text-brand-purple/60">
              {fileName}
            </p>
          )}
          <p className="mt-1 text-[11px] text-brand-purple/50">
            MP4, WebM alebo MOV · max. 50 MB
          </p>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-medium text-brand-purple/55">
            alebo vložte odkaz
          </p>
          <input
            name="videoUrl"
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setFileName(null);
              setFilePreview(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            placeholder="https://…"
            className="admin-input"
          />
        </div>
      </div>
    </div>
  );
}
