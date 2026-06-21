"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { FollowProfileButton } from "@/components/FollowProfileButton";
import { searchTabAction } from "@/lib/actions/tabs";

type CategoryFilter =
  | "ZDRAVA_VYZIVA"
  | "SPONZORI"
  | "DIAGNOZY"
  | "NOVINKY"
  | "AKCIE"
  | null;

type SearchResult = Awaited<ReturnType<typeof searchTabAction>> & { ok: true };

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: null, label: "Všetky" },
  { id: "ZDRAVA_VYZIVA", label: "Zdravá výživa" },
  { id: "SPONZORI", label: "Sponzori" },
  { id: "DIAGNOZY", label: "Diagnózy" },
  { id: "NOVINKY", label: "Novinky" },
  { id: "AKCIE", label: "Akcie" },
];

function ProfileList({
  profiles,
  followingIds,
}: {
  profiles: SearchResult["profiles"];
  followingIds: Set<string>;
}) {
  if (profiles.length === 0) {
    return (
      <p className="mx-5 mt-6 text-center text-sm text-brand-purple/50">
        Žiadne profily v tejto kategórii.
      </p>
    );
  }
  return (
    <div className="flex flex-col">
      {profiles.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-4 border-b border-brand-purple/6 px-5 py-3.5 last:border-0"
        >
          <Link href={`/home/profiles/${p.handle}`} className="shrink-0">
            <div
              className="h-14 w-14 rounded-full bg-cover bg-center ring-2 ring-brand-purple/10"
              style={
                p.avatarUrl
                  ? { backgroundImage: `url(${p.avatarUrl})` }
                  : { background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)" }
              }
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/home/profiles/${p.handle}`}>
              <p className="truncate text-sm font-bold uppercase tracking-wide text-brand-purple">
                {p.displayName}
              </p>
            </Link>
            <div className="mt-1.5">
              <FollowProfileButton
                profileId={p.id}
                handle={p.handle}
                isFollowing={followingIds.has(p.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col px-5 py-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-4 border-b border-brand-purple/6 py-3.5 last:border-0"
        >
          <div className="h-14 w-14 shrink-0 rounded-full bg-brand-purple/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-32 rounded-full bg-brand-purple/10" />
            <div className="h-6 w-20 rounded-xl bg-brand-purple/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchTabPanel() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchTabAction("", null).then((res) => {
      if (res.ok) setResult(res as SearchResult);
    });
  }, []);

  const doSearch = (q: string, cat: CategoryFilter) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        void searchTabAction(q, cat).then((res) => {
          if (res.ok) setResult(res as SearchResult);
        });
      });
    }, 300);
  };

  const handleInput = (value: string) => {
    setQuery(value);
    doSearch(value, activeCategory);
  };

  const handleCategory = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    startTransition(() => {
      void searchTabAction(query, cat).then((res) => {
        if (res.ok) setResult(res as SearchResult);
      });
    });
  };

  const followingIds = new Set(result?.followingProfileIds ?? []);
  const profiles = result?.profiles ?? [];

  return (
    <>
      {/* Searchbar */}
      <section className="px-5 pb-4 pt-4">
        <div className="flex items-center gap-3 rounded-full border border-brand-purple/12 bg-white px-6 py-4 shadow-md">
          <input
            ref={inputRef}
            type="search"
            placeholder="Hľadať profily..."
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            className="flex-1 bg-transparent text-base font-medium text-brand-purple placeholder-brand-purple/35 outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                handleInput("");
                inputRef.current?.focus();
              }}
              className="shrink-0 text-brand-purple/40"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 text-brand-purple/40"
              fill="none"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </section>

      {/* Kategórie */}
      <section className="pb-4 pl-5">
        <div className="no-scrollbar flex items-center gap-2.5 overflow-x-auto pr-5">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.id ?? "vsetky"}
              type="button"
              onClick={() => handleCategory(f.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeCategory === f.id
                  ? "bg-brand-pink text-white shadow-sm"
                  : "border-2 border-brand-purple/15 text-brand-purple/70 hover:bg-brand-purple/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Zoznam profilov */}
      <section className="pb-6">
        {!result ? (
          <LoadingSkeleton />
        ) : (
          <ProfileList profiles={profiles} followingIds={followingIds} />
        )}
      </section>
    </>
  );
}
