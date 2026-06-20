"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { FeedProfileHeader } from "@/components/FeedProfileHeader";
import { LikeButton } from "@/components/LikeButton";
import { fetchLibraryAction } from "@/lib/actions/library";
import {
  KNIZNICA_SCROLL_KEY,
  parseLibraryKind,
  type LibraryKind,
  type LibrarySort,
} from "@/lib/library";
import { toggleSavedPostAction } from "@/lib/actions/post-saves";
import { defaultProfileLabel } from "@/lib/feed";
import {
  buildPostGallery,
  libraryReturnPath,
  postCoverFallback,
  postHrefWithReturn,
} from "@/lib/post-display";
import type { FeedPostRow } from "@/lib/feed-queries";

type LibraryData = Awaited<ReturnType<typeof fetchLibraryAction>> & { ok: true };

const TABS: { id: LibraryKind; label: string; icon: React.FC }[] = [
  { id: "audio", label: "Audio", icon: HeadphonesIcon },
  { id: "clanky", label: "Články", icon: ArticleIcon },
  { id: "video", label: "Video", icon: VideoIcon },
  { id: "novinky", label: "Novinky", icon: NewsIcon },
];

export function ContentLibrary() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [kind, setKind] = useState<LibraryKind>(
    () => parseLibraryKind(searchParams.get("kind")) ?? "audio",
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<LibrarySort>("newest");
  const [data, setData] = useState<LibraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Restore scroll position when returning from a post detail page.
  useEffect(() => {
    if (loading || !data) return;
    const saved = sessionStorage.getItem(KNIZNICA_SCROLL_KEY);
    if (saved === null) return;
    sessionStorage.removeItem(KNIZNICA_SCROLL_KEY);
    const top = Number(saved);
    if (!Number.isFinite(top)) return;
    requestAnimationFrame(() => {
      const scrollEl = document.querySelector("[data-app-scroll]");
      if (scrollEl) scrollEl.scrollTop = top;
    });
  }, [loading, data]);

  const selectKind = (next: LibraryKind) => {
    setKind(next);
    router.replace(`/home/kniznica?kind=${next}`, { scroll: false });
  };

  useEffect(() => {
    setLoading(true);
    startTransition(() => {
      void fetchLibraryAction({ kind, query, sort }).then((res) => {
        if (res.ok) setData(res as LibraryData);
        setLoading(false);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, sort]);

  // Keep the active category pill visible within the tab row only (avoid scrolling
  // the page horizontally, which would peek the closed menu drawer).
  useEffect(() => {
    const nav = navRef.current;
    const activeTab = nav?.querySelector<HTMLElement>(`[data-kind="${kind}"]`);
    if (nav && activeTab) {
      const targetLeft =
        activeTab.offsetLeft - (nav.clientWidth - activeTab.offsetWidth) / 2;
      nav.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    }

    // Returning from a post — scroll restore runs after data loads.
    if (sessionStorage.getItem(KNIZNICA_SCROLL_KEY) !== null) return;

    const scrollEl = document.querySelector("[data-app-scroll]");
    if (scrollEl) scrollEl.scrollTop = 0;
  }, [kind]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      startTransition(() => {
        void fetchLibraryAction({ kind, query: value, sort }).then((res) => {
          if (res.ok) setData(res as LibraryData);
          setLoading(false);
        });
      });
    }, 300);
  };

  const likedIds = new Set(data?.likedPostIds ?? []);
  const savedIds = new Set(data?.savedPostIds ?? []);
  const followingIds = new Set(data?.followingProfileIds ?? []);
  const posts = data?.posts ?? [];

  return (
    <>
      {/* Sticky search + filters — stay visible while scrolling long lists (e.g. Články) */}
      <div className="sticky top-[57px] z-[9] bg-white pb-1 shadow-[0_1px_0_rgba(111,35,128,0.06)]">
        {/* Search */}
        <section className="px-5 pb-2 pt-3">
          <div className="flex items-center gap-2 rounded-full bg-brand-pink-soft px-4 py-2.5">
            <SearchIcon />
            <input
              type="search"
              placeholder="Hľadať"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-brand-purple placeholder-brand-purple/40 outline-none"
            />
          </div>
        </section>

        {/* Filter tabs */}
        <nav
          ref={navRef}
          aria-label="Kategórie obsahu"
          className="no-scrollbar flex items-center gap-2.5 overflow-x-auto px-5 pb-2 pt-1"
        >
          {TABS.map((tab) => {
            const active = tab.id === kind;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                data-kind={tab.id}
                onClick={() => selectKind(tab.id)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2 rounded-pill border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-brand-pink bg-brand-pink text-white"
                    : "border-brand-purple/15 bg-white text-brand-purple"
                }`}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Sort toggle */}
        <div className="flex items-center px-5 pb-2 pt-1">
          <button
            type="button"
            onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
            className="flex items-center gap-2 text-sm font-semibold text-brand-purple"
          >
            <SortIcon />
            {sort === "newest" ? "Najnovšie" : "Najstaršie"}
          </button>
        </div>
      </div>

      {/* Content */}
      <section className="pt-1">
        {loading && !data ? (
          <LibrarySkeleton />
        ) : posts.length === 0 ? (
          <div className="mx-4 mt-3 rounded-3xl bg-white p-6 text-center text-xs text-brand-purple/70 shadow-card">
            {query
              ? `Pre „${query}“ sme nič nenašli.`
              : "Zatiaľ tu nie je žiadny obsah."}
          </div>
        ) : (
          posts.map((post) => (
            <LibraryItem
              key={post.id}
              kind={kind}
              post={post}
              liked={likedIds.has(post.id)}
              saved={savedIds.has(post.id)}
              following={
                post.profile ? followingIds.has(post.profile.id) : false
              }
            />
          ))
        )}
      </section>
    </>
  );
}

function LibraryItem({
  kind,
  post,
  liked,
  saved,
  following,
}: {
  kind: LibraryKind;
  post: FeedPostRow;
  liked: boolean;
  saved: boolean;
  following: boolean;
}) {
  const displayKind = kind === "novinky" ? novinkyDisplayKind(post.type) : kind;

  if (displayKind === "video") {
    return (
      <VideoItem post={post} kind={kind} liked={liked} saved={saved} />
    );
  }
  if (displayKind === "audio") {
    return (
      <AudioItem
        post={post}
        kind={kind}
        liked={liked}
        saved={saved}
        following={following}
      />
    );
  }
  return (
    <ArticleItem
      post={post}
      kind={kind}
      liked={liked}
      saved={saved}
      following={following}
    />
  );
}

function novinkyDisplayKind(type: FeedPostRow["type"]): LibraryKind {
  if (type === "VIDEO") return "video";
  if (type === "AUDIO") return "audio";
  return "clanky";
}

function saveLibraryScroll() {
  const scrollEl = document.querySelector("[data-app-scroll]");
  sessionStorage.setItem(
    KNIZNICA_SCROLL_KEY,
    String(scrollEl?.scrollTop ?? 0),
  );
}

function libraryPostHref(postId: string, kind: LibraryKind) {
  return postHrefWithReturn(postId, libraryReturnPath(kind));
}

/* ─────────────── Články / Novinky ─────────────── */

function ArticleItem({
  post,
  kind,
  liked,
  saved,
  following,
}: {
  post: FeedPostRow;
  kind: LibraryKind;
  liked: boolean;
  saved: boolean;
  following: boolean;
}) {
  const label = defaultProfileLabel(post.profile);
  const href = libraryPostHref(post.id, kind);
  const cover = buildPostGallery(post.coverUrl, post.images)[0] ?? null;

  return (
    <article className="border-b border-brand-purple/10">
      <FeedProfileHeader
        profileId={post.profile?.id}
        isFollowing={following}
        {...label}
      />

      <Link href={href} onClick={saveLibraryScroll} className="flex gap-3 px-4">
        <h3 className="line-clamp-4 flex-1 text-[15px] font-bold leading-snug text-brand-purple">
          {post.title}
        </h3>
        <Thumb url={cover} fallback={postCoverFallback(post.type)} size="lg" />
      </Link>

      <div className="flex items-center gap-5 px-4 py-3">
        <LikeButton
          postId={post.id}
          liked={liked}
          count={post._count.likes}
          variant="feed"
        />
        <CommentLink href={href} />
        <span className="flex-1" />
        <SaveButton postId={post.id} saved={saved} />
      </div>
    </article>
  );
}

/* ─────────────── Audio ─────────────── */

function AudioItem({
  post,
  kind,
  liked,
  saved,
  following,
}: {
  post: FeedPostRow;
  kind: LibraryKind;
  liked: boolean;
  saved: boolean;
  following: boolean;
}) {
  const label = defaultProfileLabel(post.profile);
  const href = libraryPostHref(post.id, kind);
  const cover = buildPostGallery(post.coverUrl, post.images)[0] ?? null;
  const duration = formatDuration(post.durationSec);
  const date = formatPostDate(post.publishedAt ?? post.createdAt);

  return (
    <article className="border-b border-brand-purple/10">
      <FeedProfileHeader
        profileId={post.profile?.id}
        isFollowing={following}
        {...label}
      />

      <Link href={href} onClick={saveLibraryScroll} className="flex gap-3 px-4">
        <Thumb url={cover} fallback={postCoverFallback(post.type)} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-brand-purple">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-brand-purple/65">
              {post.excerpt}
            </p>
          )}
        </div>
      </Link>

      <div className="flex items-center gap-5 px-4 py-3">
        <LikeButton
          postId={post.id}
          liked={liked}
          count={post._count.likes}
          variant="feed"
        />
        <CommentLink href={href} />
        <span className="flex flex-1 items-center justify-end gap-2.5 text-xs font-medium text-brand-purple/60">
          <span>{date}</span>
          {duration && <span>{duration}</span>}
          <Link
            href={href}
            onClick={saveLibraryScroll}
            aria-label="Prehrať"
            className="grid h-8 w-8 place-items-center rounded-full bg-brand-pink text-white"
          >
            <PlayIcon />
          </Link>
        </span>
        <SaveButton postId={post.id} saved={saved} />
      </div>
    </article>
  );
}

/* ─────────────── Video ─────────────── */

function VideoItem({
  post,
  kind,
  liked,
  saved,
}: {
  post: FeedPostRow;
  kind: LibraryKind;
  liked: boolean;
  saved: boolean;
}) {
  const href = libraryPostHref(post.id, kind);
  const cover = buildPostGallery(post.coverUrl, post.images)[0] ?? null;
  const duration = formatDuration(post.durationSec);
  const date = formatPostDate(post.publishedAt ?? post.createdAt);

  return (
    <article className="border-b border-brand-purple/10 px-4 py-4">
      <Link href={href} onClick={saveLibraryScroll} className="block">
        <div
          className="relative aspect-video w-full overflow-hidden rounded-2xl bg-cover bg-center"
          style={
            cover
              ? { backgroundImage: `url(${cover})` }
              : { background: postCoverFallback(post.type) }
          }
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-brand-purple shadow-lg">
              <PlayIcon large />
            </span>
          </div>
          <span className="absolute bottom-2 left-2 flex items-center gap-2 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
            <span>{date}</span>
            {duration && <span>{duration}</span>}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-[15px] font-bold leading-snug text-brand-purple">
          {post.title}
        </h3>
      </Link>

      <div className="mt-1 flex items-center gap-5">
        <LikeButton
          postId={post.id}
          liked={liked}
          count={post._count.likes}
          variant="feed"
        />
        <CommentLink href={href} />
        <span className="flex-1" />
        <SaveButton postId={post.id} saved={saved} />
      </div>
    </article>
  );
}

/* ─────────────── Shared bits ─────────────── */

function Thumb({
  url,
  fallback,
  size,
}: {
  url: string | null;
  fallback: string;
  size: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-[88px] w-[88px]" : "h-16 w-16";
  return (
    <div
      className={`${dim} shrink-0 overflow-hidden rounded-xl bg-cover bg-center`}
      style={url ? { backgroundImage: `url(${url})` } : { background: fallback }}
      aria-hidden
    />
  );
}

function SaveButton({ postId, saved }: { postId: string; saved: boolean }) {
  const [isSaved, setIsSaved] = useState(saved);
  const [, startTransition] = useTransition();

  const toggle = () => {
    setIsSaved((s) => !s);
    const fd = new FormData();
    fd.set("postId", postId);
    startTransition(() => {
      void toggleSavedPostAction(fd);
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isSaved ? "Odložené" : "Uložiť"}
      className={`transition-colors ${isSaved ? "text-brand-purple" : "text-brand-purple/60"}`}
    >
      <BookmarkIcon filled={isSaved} />
    </button>
  );
}

function CommentLink({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="Komentáre" className="text-brand-purple/60">
      <CommentIcon />
    </Link>
  );
}

function LibrarySkeleton() {
  return (
    <div className="space-y-4 px-4 py-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-brand-purple/10" />
            <div className="h-3.5 w-32 rounded-full bg-brand-purple/10" />
          </div>
          <div className="h-20 w-full rounded-2xl bg-brand-purple/10" />
        </div>
      ))}
    </div>
  );
}

/* ─────────────── Formatting ─────────────── */

function formatDuration(durationSec: number | null | undefined): string | null {
  if (!durationSec || durationSec <= 0) return null;
  const minutes = Math.max(1, Math.round(durationSec / 60));
  return `${minutes} min`;
}

function formatPostDate(date: Date | string): string {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

/* ─────────────── Icons ─────────────── */

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand-purple/50" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <path d="M4 13v-1a8 8 0 0116 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ArticleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <path d="M6 3h9l4 4v14H6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <rect x="3" y="6" width="13" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 10l5-2.5v9L16 14z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <path d="M4 6h12v13H5a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 9h3v8a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M7 9h6M7 12h6M7 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M7 4v16m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 20V4m0 0l-3 3m3-3l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon({ large = false }: { large?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={large ? "h-6 w-6 translate-x-0.5" : "h-4 w-4 translate-x-px"} fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
