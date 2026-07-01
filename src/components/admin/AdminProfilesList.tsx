"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";

export type AdminProfileListItem = {
  id: string;
  displayName: string;
  handle: string;
  avatarUrl: string | null;
  published: boolean;
  categoryLabel: string | null;
  featured?: boolean;
  countsText: string;
  manageHref: string;
  previewHref: string;
};

export function AdminProfilesList({
  items,
  toggleAction,
  deleteAction,
  deleteConfirmText,
  emptyText,
  listId,
}: {
  items: AdminProfileListItem[];
  toggleAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  deleteConfirmText: string;
  emptyText: string;
  listId: string;
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return items;
    return items.filter((it) =>
      [it.displayName, it.handle, it.categoryLabel ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [items, normalized]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-purple/40"
          fill="none"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hľadať profil podľa mena alebo @identifikátora…"
          list={listId}
          className="admin-input pl-10 pr-10"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Vymazať hľadanie"
            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-brand-purple/40 transition hover:bg-brand-purple/8 hover:text-brand-purple"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <datalist id={listId}>
          {items.map((it) => (
            <option key={it.id} value={it.displayName} />
          ))}
        </datalist>
      </div>

      {normalized && (
        <p className="px-1 text-xs text-brand-purple/50">
          {filtered.length} {filtered.length === 1 ? "výsledok" : filtered.length < 5 ? "výsledky" : "výsledkov"}
        </p>
      )}

      <div className="admin-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-brand-purple/50">
            {normalized ? "Žiadny profil nezodpovedá hľadaniu." : emptyText}
          </p>
        ) : (
          <ul className="divide-y divide-brand-purple/8">
            {filtered.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-purple/[0.02]">
                <div
                  className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center ring-1 ring-brand-purple/10"
                  style={profileAvatarStyle(p.avatarUrl)}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-purple">{p.displayName}</p>
                  <p className="text-xs text-brand-purple/50">
                    @{p.handle}
                    {p.categoryLabel && <span className="ml-2 text-brand-pink/80">{p.categoryLabel}</span>}
                    {p.featured && <span className="ml-2 font-medium text-brand-pink">★ Odporúčaná</span>}
                    <span className="ml-2">{p.countsText}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={p.manageHref}
                    className="rounded bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white hover:brightness-110"
                  >
                    Spravovať
                  </Link>
                  <Link
                    href={p.previewHref}
                    className="rounded border border-brand-purple/20 px-3.5 py-1.5 text-xs font-semibold text-brand-purple hover:bg-brand-purple/5"
                  >
                    Náhľad
                  </Link>
                  <form action={toggleAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="current" value={String(p.published)} />
                    <button
                      type="submit"
                      className={`rounded px-3.5 py-1.5 text-xs font-semibold transition ${
                        p.published
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      {p.published ? "Publikovaný" : "Skrytý"}
                    </button>
                  </form>
                  <DeleteConfirmButton action={deleteAction} id={p.id} confirmText={deleteConfirmText} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
