"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ForumFollowButton } from "@/components/ForumFollowButton";
import { fetchForumsTabAction } from "@/lib/actions/tabs";
import { forumAvatarStyle } from "@/lib/avatar-style";

type ForumFilter = "all" | "popular" | "following";

const FILTERS: { id: ForumFilter; label: string }[] = [
  { id: "all", label: "Všetky" },
  { id: "popular", label: "Populárne" },
  { id: "following", label: "Sledované" },
];

type ForumsData = Awaited<ReturnType<typeof fetchForumsTabAction>> & { ok: true };

function TabSkeleton() {
  return (
    <div className="space-y-3 px-5 py-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card">
          <div className="h-[68px] w-[68px] shrink-0 rounded-2xl bg-brand-purple/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-36 rounded-full bg-brand-purple/10" />
            <div className="h-3 w-20 rounded-full bg-brand-purple/8" />
            <div className="h-3 w-48 rounded-full bg-brand-purple/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ForumsTabPanel({ initialData }: { initialData?: ForumsData }) {
  const [data, setData] = useState<ForumsData | null>(initialData ?? null);
  const [failed, setFailed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ForumFilter>("all");

  useEffect(() => {
    if (initialData) return;
    fetchForumsTabAction()
      .then((res) => {
        if (res.ok) setData(res as ForumsData);
        else setFailed(true);
      })
      .catch(() => setFailed(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (failed)
    return (
      <div className="px-5 py-8 text-center text-sm text-brand-purple/50">
        Obsah sa nepodarilo načítať. Skúste obnoviť stránku.
      </div>
    );
  if (!data) return <TabSkeleton />;

  const followingIds = new Set(data.followingForumIds);

  const filteredForums = useMemo(() => {
    let list = [...data.forums];
    if (activeFilter === "following") {
      list = list.filter((f) => followingIds.has(f.id));
    } else if (activeFilter === "popular") {
      list = [...list].sort((a, b) => b._count.members - a._count.members);
    }
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.forums, activeFilter, data.followingForumIds]);

  return (
    <div className="forum-page min-h-full">
      <section className="px-5 pb-1 pt-1">
        <h2 className="text-lg font-bold text-brand-purple">Fóra</h2>
        <p className="mt-0.5 text-xs text-brand-purple/55">
          Diskusie, podpora a zdieľanie skúseností
        </p>
      </section>

      <section className="px-5 pb-4 pt-3">
        <Link href="/home/forums/search" className="forum-search flex items-center justify-between">
          <span className="text-brand-purple/45">Hľadať fóra…</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand-purple/50" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
      </section>

      {/* Filter chips */}
      <section className="pb-3 pl-5">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pr-5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeFilter === f.id
                  ? "bg-brand-pink text-white shadow-sm"
                  : "border-2 border-brand-purple/15 text-brand-purple/70 hover:bg-brand-purple/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {data.pendingForums.length > 0 && (
        <section className="px-5 pb-4">
          <h3 className="forum-section-label mb-3">Čaká na schválenie</h3>
          <ul className="flex flex-col gap-3">
            {data.pendingForums.map((forum) => (
              <li
                key={forum.id}
                className="flex items-center gap-3 rounded-3xl border border-dashed border-amber-300/60 bg-amber-50/50 p-4"
              >
                <div
                  aria-hidden
                  className="h-14 w-14 shrink-0 rounded-2xl bg-cover bg-center opacity-90 ring-2 ring-white"
                  style={forumAvatarStyle(forum)}
                />
                <div>
                  <h3 className="text-sm font-bold text-brand-purple">{forum.title}</h3>
                  <p className="mt-1 text-[11px] font-medium text-amber-700">
                    Čaká na schválenie administrátorom
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {filteredForums.length === 0 ? (
        <div className="forum-empty mx-5 mt-2">
          {activeFilter === "following"
            ? "Zatiaľ nesledujete žiadne fóra."
            : data.userTypes.length > 0
              ? "Zatiaľ žiadne fóra pre váš typ rakoviny."
              : "Zatiaľ žiadne schválené fóra."}
        </div>
      ) : (
        <ul className="flex flex-col gap-3 px-5 pb-4">
          {filteredForums.map((forum) => (
            <li key={forum.id} className="forum-card p-4">
              <div className="flex items-start gap-4">
                <Link href={`/home/forums/${forum.id}`} className="shrink-0" aria-label={forum.title}>
                  <div
                    aria-hidden
                    className="h-[68px] w-[68px] rounded-2xl bg-cover bg-center ring-2 ring-white shadow-sm"
                    style={{
                      ...forumAvatarStyle(forum),
                      boxShadow: `0 4px 16px ${forum.accentColor ?? "#6F2380"}28`,
                    }}
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/home/forums/${forum.id}`} className="min-w-0">
                      <h2 className="truncate text-[15px] font-bold leading-snug text-brand-purple">
                        {forum.title}
                      </h2>
                    </Link>
                    <ForumFollowButton
                      forumId={forum.id}
                      isFollowing={followingIds.has(forum.id)}
                      size="md"
                      joinLabel="Zapojiť sa"
                      joinedLabel="Zapojené"
                    />
                  </div>
                  <span className="forum-chip mt-2">
                    <MembersIcon />
                    {forum._count.members} členov
                  </span>
                </div>
              </div>
              {forum.description && (
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-brand-purple/70">
                  {forum.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

function MembersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
      <path
        d="M16 19a4 4 0 00-8 0M12 12a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
