"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { FeedProfileHeader } from "@/components/FeedProfileHeader";
import { FeedPostItem } from "@/components/FeedPostItem";
import { FeedEventItem } from "@/components/FeedEventItem";
import { searchTabAction } from "@/lib/actions/tabs";
import { buildPostGallery, postPublicHref } from "@/lib/post-display";
import { defaultProfileLabel } from "@/lib/feed";
import type { FeedPostRow, FeedEventRow } from "@/lib/feed-queries";

type SearchResult = Awaited<ReturnType<typeof searchTabAction>> & { ok: true };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMixedFeed(posts: FeedPostRow[], events: FeedEventRow[], hasQuery: boolean) {
  const items = [
    ...posts.map((p) => ({ kind: "post" as const, post: p, sortAt: p.publishedAt ?? p.createdAt })),
    ...events.map((e) => ({ kind: "event" as const, event: e, sortAt: e.startsAt })),
  ];
  if (!hasQuery) return shuffle(items);
  return items.sort((a, b) => new Date(b.sortAt).getTime() - new Date(a.sortAt).getTime());
}

export function SearchTabPanel() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial discovery load
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

  const likedIds = new Set(result?.likedPostIds ?? []);
  const savedIds = new Set(result?.savedPostIds ?? []);
  const followingIds = new Set(result?.followingProfileIds ?? []);
  const registeredIds = new Set(result?.registeredEventIds ?? []);
  const [firstName, ...rest] = (result?.userName ?? " ").split(" ");
  const lastName = rest.join(" ");

  const feed = result
    ? buildMixedFeed(result.posts, result.events, query.length > 0)
    : [];

  return (
    <>
      {/* Search input */}
      <section className="px-5 py-3">
        <div className="flex items-center gap-2 rounded-full bg-brand-pink-soft px-4 py-2.5">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand-purple/50" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            placeholder="Hľadať ľudí, príspevky…"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            className="flex-1 bg-transparent text-sm text-brand-purple placeholder-brand-purple/40 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); handleInput(""); inputRef.current?.focus(); }}
              className="text-brand-purple/40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Profiles rail */}
      {(result?.profiles.length ?? 0) > 0 && (
        <section className="mt-2">
          <h2 className="px-5 text-xs font-bold uppercase tracking-wide text-brand-purple/70">
            Skupiny
          </h2>
          <div className="no-scrollbar mt-3 flex gap-4 overflow-x-auto px-5 pb-1">
            {result!.profiles.map((p) => (
              <Link
                key={p.id}
                href={`/home/profiles/${p.handle}`}
                className="flex w-16 shrink-0 flex-col items-center gap-1.5"
              >
                <div
                  className="h-16 w-16 rounded-full border-2 border-brand-pink/40 bg-cover bg-center"
                  style={
                    p.avatarUrl
                      ? { backgroundImage: `url(${p.avatarUrl})` }
                      : { background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)" }
                  }
                />
                <span className="line-clamp-2 text-center text-[10px] font-medium leading-tight text-brand-purple">
                  {p.displayName}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Mixed feed */}
      <section className="mt-4">
        <h2 className="px-5 text-xs font-bold uppercase tracking-wide text-brand-purple/70">
          {query ? "Výsledky" : "Aktivita skupín"}
        </h2>
        <div className="mt-3 pb-6">
          {!result ? (
            <div className="space-y-4 px-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse h-40 rounded-2xl bg-brand-purple/8" />
              ))}
            </div>
          ) : feed.length === 0 ? (
            <div className="mx-5 rounded-3xl bg-white p-6 text-center text-xs text-brand-purple/70 shadow-card">
              {query ? `Pre "${query}" sme nič nenašli.` : "Zatiaľ žiadny obsah."}
            </div>
          ) : (
            feed.map((item) => {
              if (item.kind === "event") {
                const e = item.event;
                const label = defaultProfileLabel(e.profile);
                return (
                  <div key={`e-${e.id}`}>
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
              }
              const p = item.post;
              const label = defaultProfileLabel(p.profile);
              return (
                <div key={`p-${p.id}`}>
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
          )}
        </div>
      </section>
    </>
  );
}
