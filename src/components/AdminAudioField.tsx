"use client";

import { useRef, useState } from "react";

/** Admin audio field — upload a file or paste a URL, with preview. */
export function AdminAudioField({
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

  return (
    <div className="block">
      <span className="admin-label">Audio</span>
      <p className="mb-3 text-[11px] text-brand-purple/55">
        Nahrajte audio zo počítača alebo vložte odkaz. Použite pri type „Audio“.
      </p>

      {previewUrl && (
        <div className="mb-4 overflow-hidden rounded-xl border border-brand-purple/10 bg-brand-purple/5 px-4 py-4">
          <audio
            src={previewUrl}
            controls
            preload="metadata"
            className="w-full"
          />
        </div>
      )}

      <div className="space-y-3">
        <div>
          <input
            ref={fileRef}
            type="file"
            name="audioFile"
            accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg,audio/webm"
            className="sr-only"
            onChange={(e) => onFileChange(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="admin-btn-outline w-full sm:w-auto"
          >
            Nahrať audio zo počítača
          </button>
          {fileName && (
            <p className="mt-1.5 truncate text-xs text-brand-purple/60">
              {fileName}
            </p>
          )}
          <p className="mt-1 text-[11px] text-brand-purple/50">
            MP3, M4A, WAV, OGG alebo WebM · max. 25 MB
          </p>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-medium text-brand-purple/55">
            alebo vložte odkaz
          </p>
          <input
            name="audioUrl"
            type="url"
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
