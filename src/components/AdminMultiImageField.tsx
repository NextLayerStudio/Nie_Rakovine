"use client";

import { useRef, useState } from "react";
import { IMAGE_FILE_INPUT_ACCEPT } from "@/lib/image-upload-limits";

type ExistingImage = { id: string; url: string };

/** Admin gallery — upload multiple files; manage existing images on edit. */
export function AdminMultiImageField({
  existingImages = [],
}: {
  existingImages?: ExistingImage[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [newPreviews, setNewPreviews] = useState<
    { key: string; src: string; name: string }[]
  >([]);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const visibleExisting = existingImages.filter((img) => !removedIds.has(img.id));

  function onFilesChange(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).map((file) => ({
      key: `${file.name}-${file.lastModified}`,
      src: URL.createObjectURL(file),
      name: file.name,
    }));
    setNewPreviews((prev) => [...prev, ...next]);
  }

  function toggleRemove(id: string) {
    setRemovedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="block">
      <span className="admin-label">Ďalšie obrázky</span>
      <p className="mb-3 text-[11px] text-brand-purple/55">
        Nahrajte viac fotiek naraz. Zobrazia sa v galérii príspevku popri
        titulnom obrázku.
      </p>

      {visibleExisting.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-[11px] font-medium text-brand-purple/55">
            Existujúce obrázky
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visibleExisting.map((img) => (
              <li key={img.id} className="relative">
                <div
                  aria-hidden
                  className="aspect-square w-full rounded-xl border border-brand-purple/10 bg-cover bg-center"
                  style={{ backgroundImage: `url(${img.url})` }}
                />
                <button
                  type="button"
                  onClick={() => toggleRemove(img.id)}
                  className="mt-2 w-full rounded-lg border border-red-200 px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                >
                  Odstrániť
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {[...removedIds].map((id) => (
        <input key={id} type="hidden" name="removeImageIds" value={id} />
      ))}

      <input
        ref={fileRef}
        type="file"
        name="galleryFiles"
        accept={IMAGE_FILE_INPUT_ACCEPT}
        multiple
        className="sr-only"
        onChange={(e) => onFilesChange(e.target.files)}
      />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="admin-btn-outline w-full sm:w-auto"
      >
        Pridať obrázky
      </button>
      <p className="mt-1 text-[11px] text-brand-purple/50">
        JPG, PNG, WebP alebo GIF · do 20 MB · automaticky zmenšené
      </p>

      {newPreviews.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {newPreviews.map((preview) => (
            <li key={preview.key}>
              <div
                aria-hidden
                className="aspect-square w-full rounded-xl border border-brand-purple/10 bg-cover bg-center"
                style={{ backgroundImage: `url(${preview.src})` }}
              />
              <p className="mt-1 truncate text-[11px] text-brand-purple/60">
                {preview.name}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
