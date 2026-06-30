"use client";

import Link from "next/link";

export function AdminItemActions({
  editHref,
  deleteAction,
  id,
  editLabel = "Spravovať",
  compact = false,
  hiddenFields,
}: {
  editHref: string;
  deleteAction: (formData: FormData) => Promise<void>;
  id: string;
  editLabel?: string;
  compact?: boolean;
  hiddenFields?: Record<string, string>;
}) {
  return (
    <div
      className={`mt-auto border-t border-brand-purple/10 ${
        compact ? "flex flex-col gap-2 px-3 py-2" : "flex items-center justify-end gap-3 px-4 py-3"
      }`}
    >
      <Link
        href={editHref}
        className={`rounded bg-brand-purple text-xs font-semibold text-white transition hover:brightness-110 ${
          compact ? "block py-2 text-center" : "px-4 py-1.5"
        }`}
      >
        {editLabel}
      </Link>
      <form action={deleteAction} className={compact ? "w-full" : undefined}>
        <input type="hidden" name="id" value={id} />
        {hiddenFields &&
          Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        <button
          type="submit"
          onClick={(e) => {
            if (!window.confirm("Naozaj chceš zmazať túto položku? Táto akcia je nezvratná.")) {
              e.preventDefault();
            }
          }}
          className={`rounded border border-red-200 bg-red-50 text-xs font-semibold text-red-700 transition hover:bg-red-100 ${
            compact ? "w-full py-2" : "px-4 py-1.5"
          }`}
        >
          Zmazať
        </button>
      </form>
    </div>
  );
}
