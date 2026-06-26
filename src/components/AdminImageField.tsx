"use client";

import { useRef, useState } from "react";
import { IMAGE_FILE_INPUT_ACCEPT } from "@/lib/image-upload-limits";

/** Admin image field — upload a file or paste a URL, with live preview. */
export function AdminImageField({
  name,
  uploadName,
  label,
  hint,
  defaultValue = "",
  shape = "circle",
  previewAspect = "square",
}: {
  name: string;
  /** When set, shows a file picker that submits with this field name. */
  uploadName?: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  shape?: "circle" | "rounded";
  previewAspect?: "square" | "video";
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const previewClass =
    shape === "circle"
      ? "h-20 w-20 rounded-full"
      : previewAspect === "video"
        ? "h-24 w-40 rounded-xl"
        : "h-20 w-32 rounded-xl";

  const previewSrc = filePreview || url.trim() || null;

  const previewStyle = previewSrc
    ? {
        backgroundImage: `url(${previewSrc})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : {
        background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)",
      };

  function onFileChange(file: File | undefined) {
    if (!file) {
      setFilePreview(null);
      setFileName(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
    setFileName(file.name);
  }

  return (
    <div className="block">
      <span className="admin-label">{label}</span>
      {hint && (
        <p className="mb-2 text-[11px] text-brand-purple/55">{hint}</p>
      )}

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
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="admin-btn-outline w-full sm:w-auto"
              >
                Vybrať obrázok z počítača
              </button>
              {fileName && (
                <p className="mt-1.5 truncate text-xs text-brand-purple/60">
                  {fileName}
                </p>
              )}
              <p className="mt-1 text-[11px] text-brand-purple/50">
                JPG, PNG, WebP alebo GIF · do 20 MB · automaticky zmenšené
              </p>
            </div>
          )}

          <div>
            {uploadName && (
              <p className="mb-1 text-[11px] font-medium text-brand-purple/55">
                alebo vložte odkaz
              </p>
            )}
            <input
              name={name}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className="admin-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
