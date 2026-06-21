"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { FeedProfileHeader } from "@/components/FeedProfileHeader";
import { FeedPostItem } from "@/components/FeedPostItem";
import { FeedEventItem } from "@/components/FeedEventItem";
import { FollowProfileButton } from "@/components/FollowProfileButton";
import { searchTabAction } from "@/lib/actions/tabs";
import { buildPostGallery, postPublicHref } from "@/lib/post-display";
import { defaultProfileLabel } from "@/lib/feed";

type FilterType = "profily" | "prispevky" | "videa" | "akcie";
type SearchResult = Awaited<ReturnType<typeof searchTabAction>> & { ok: true };

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "profily", label: "Profily" },
  { id: "prispevky", label: "Príspevky" },
  { id: "videa", label: "Videá" },
  { id: "akcie", label: "Akcie" },
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
        Žiadne profily
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

function EmptyState({ query }: { query: string }) {
  return (
    <div className="mx-5 mt-4 rounded-3xl bg-white p-6 text-center text-xs text-brand-purple/70 shadow-card">
      {query ? `Pre „${query}" sme nič nenašli.` : "Zatiaľ žiadny obsah."}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col px-5 py-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 py-3.5 border-b border-brand-purple/6 last:border-0">
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
  const [activeFilter, setActiveFilter] = useState<FilterType>("profily");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchTabAction("").then((res) => {
      if (res.ok) setResult(res as SearchResult);
    });
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        void searchTabAction(value).then((res) => {
          if (res.ok) setResult(res as SearchResult);
        });
      });
    }, 300);
  };

  const followingIds = new Set(result?.followingProfileIds ?? []);
  const likedIds = new Set(result?.likedPostIds ?? []);
  const savedIds = new Set(result?.savedPostIds ?? []);
  const registeredIds = new Set(result?.registeredEventIds ?? []);
  const [firstName, ...rest] = (result?.userName ?? " ").split(" ");
  const lastName = rest.join(" ");

  const profiles = result?.profiles ?? [];
  const allPosts = result?.posts ?? [];
  const events = result?.events ?? [];
  const videoPosts = allPosts.filter((p) => p.type === "VIDEO");

  return (
    <>
      {/* Searchbar — biely, hrubší */}
      <section className="px-5 pb-3 pt-4">
        <div className="flex items-center gap-3 rounded-full border border-brand-purple/10 bg-white px-5 py-3.5 shadow-sm">
          <input
            ref={inputRef}
            type="search"
            placeholder="Hľadať..."
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            className="flex-1 bg-transparent text-sm text-brand-purple placeholder-brand-purple/40 outline-none"
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
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand-purple/40" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </section>

      {/* Filter chips */}
      <section className="pb-3 pl-5">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pr-5">
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-brand-purple/20 px-3 py-1.5 text-xs font-semibold text-brand-purple/60"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Filtrovať
          </button>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeFilter === f.id
                  ? "bg-brand-pink text-white"
                  : "border border-brand-purple/15 text-brand-purple/70 hover:bg-brand-purple/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Výsledky */}
      <section className="pb-6">
        {!result ? (
          <LoadingSkeleton />
        ) : activeFilter === "profily" ? (
          <ProfileList profiles={profiles} followingIds={followingIds} />
        ) : activeFilter === "prispevky" ? (
          allPosts.length === 0 ? (
            <EmptyState query={query} />
          ) : (
            allPosts.map((p) => {
              const label = defaultProfileLabel(p.profile);
              return (
                <div key={p.id}>
                  <FeedProfileHeader
                    profileId={p.profile?.id}
                    isFollowing={p.profile ? followingIds.has(p.profile.id) : false}
                    {...label}
                  />
                  <FeedPostItem
                    postId={p.id}
                    href={postPublicHref(p)}
                    type={p.type}
                    title={p.title}
                    excerpt={p.excerpt}
                    imageUrls={buildPostGallery(p.coverUrl, p.images)}
                    videoUrl={p.videoUrl ?? null}
                    audioUrl={p.audioUrl ?? null}
                    liked={likedIds.has(p.id)}
                    likeCount={p._count.likes}
                    commentCount={p._count.comments}
                    saved={savedIds.has(p.id)}
                  />
                </div>
              );
            })
          )
        ) : activeFilter === "videa" ? (
          videoPosts.length === 0 ? (
            <EmptyState query={query} />
          ) : (
            videoPosts.map((p) => {
              const label = defaultProfileLabel(p.profile);
              return (
                <div key={p.id}>
                  <FeedProfileHeader
                    profileId={p.profile?.id}
                    isFollowing={p.profile ? followingIds.has(p.profile.id) : false}
                    {...label}
                  />
                  <FeedPostItem
                    postId={p.id}
                    href={postPublicHref(p)}
                    type={p.type}
                    title={p.title}
                    excerpt={p.excerpt}
                    imageUrls={buildPostGallery(p.coverUrl, p.images)}
                    videoUrl={p.videoUrl ?? null}
                    audioUrl={p.audioUrl ?? null}
                    liked={likedIds.has(p.id)}
                    likeCount={p._count.likes}
                    commentCount={p._count.comments}
                    saved={savedIds.has(p.id)}
                  />
                </div>
              );
            })
          )
        ) : activeFilter === "akcie" ? (
          events.length === 0 ? (
            <EmptyState query={query} />
          ) : (
            events.map((e) => {
              const label = defaultProfileLabel(e.profile);
              return (
                <div key={e.id}>
                  <FeedProfileHeader
                    profileId={e.profile?.id}
                    isFollowing={e.profile ? followingIds.has(e.profile.id) : false}
                    {...label}
                  />
                  <FeedEventItem
                    id={e.id}
                    title={e.title}
                    description={e.description}
                    startsAt={e.startsAt.toISOString()}
                    endsAt={e.endsAt?.toISOString() ?? null}
                    location={e.location}
                    coverUrl={e.coverUrl}
                    isRegistered={registeredIds.has(e.id)}
                    defaultName={firstName ?? ""}
                    defaultSurname={lastName}
                  />
                </div>
              );
            })
          )
        ) : null}
      </section>
    </>
  );
}
