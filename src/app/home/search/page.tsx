import Link from "next/link";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { FeedProfileHeader } from "@/components/FeedProfileHeader";
import { FeedEventItem, FeedPostItem } from "@/components/FeedPostItem";
import { LikeButton } from "@/components/LikeButton";
import { defaultProfileLabel, type FeedItem } from "@/lib/feed";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Deterministic-ish shuffle so the discovery feed feels fresh each load. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireUser();
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const ci = (field: string) =>
    ({ [field]: { contains: query, mode: "insensitive" as const } });

  const profileWhere = {
    published: true,
    ...(query
      ? {
          OR: [ci("displayName"), ci("handle"), ci("bio")],
        }
      : {}),
  };

  const postWhere = {
    published: true,
    ...(query ? { OR: [ci("title"), ci("excerpt")] } : {}),
  };

  const eventWhere = {
    published: true,
    ...(query ? { OR: [ci("title"), ci("description")] } : {}),
  };

  const [profiles, posts, events] = await Promise.all([
    prisma.clubProfile.findMany({
      where: profileWhere,
      orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
      include: { _count: { select: { posts: true, events: true } } },
    }),
    prisma.post.findMany({
      where: postWhere,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 40,
      include: {
        profile: true,
        _count: { select: { likes: true } },
      },
    }),
    prisma.event.findMany({
      where: eventWhere,
      orderBy: { startsAt: "desc" },
      take: 20,
      include: { profile: true },
    }),
  ]);

  const [userLikes, follows] = await Promise.all([
    prisma.articleLike.findMany({
      where: { userId: user.id, postId: { in: posts.map((p) => p.id) } },
      select: { postId: true },
    }),
    prisma.profileFollow.findMany({
      where: { userId: user.id },
      select: { profileId: true },
    }),
  ]);

  const likedIds = new Set(userLikes.map((l) => l.postId));
  const followingIds = new Set(follows.map((f) => f.profileId));

  const feed: FeedItem[] = shuffle([
    ...posts.map((post) => ({
      kind: "post" as const,
      sortAt: post.publishedAt ?? post.createdAt,
      post,
    })),
    ...events.map((event) => ({
      kind: "event" as const,
      sortAt: event.startsAt,
      event,
    })),
  ]);

  return (
    <>
      <FeedHeaderWrapper />

      <section className="px-5">
        <h1 className="text-sm font-bold uppercase tracking-wide text-brand-purple">
          Objavujte
        </h1>
        <p className="mt-1 text-xs text-brand-purple/70">
          Príspevky a podujatia od všetkých skupín ONKO KLUBU.
        </p>

        <form action="/home/search" className="mt-4">
          <div className="relative">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Hľadať skupiny, príspevky, podujatia…"
              className="input-light pr-12"
            />
            <button
              type="submit"
              aria-label="Hľadať"
              className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-brand-pink text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <circle
                  cx="10.5"
                  cy="10.5"
                  r="6.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M15.8 15.8 20 20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </form>
      </section>

      {/* Browse all groups — horizontal avatar rail */}
      {profiles.length > 0 && (
        <section className="mt-5">
          <h2 className="px-5 text-xs font-bold uppercase tracking-wide text-brand-purple/70">
            Skupiny
          </h2>
          <div className="no-scrollbar mt-3 flex gap-4 overflow-x-auto px-5 pb-1">
            {profiles.map((p) => (
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
                      : {
                          background:
                            "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)",
                        }
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

      {/* Discovery feed — mixed posts + events from all profiles */}
      <section className="mt-5">
        <h2 className="px-5 text-xs font-bold uppercase tracking-wide text-brand-purple/70">
          {query ? "Výsledky" : "Aktivita skupín"}
        </h2>

        <div className="mt-3 pb-24">
          {feed.length === 0 ? (
            <div className="mx-5 rounded-3xl bg-white p-6 text-center text-xs text-brand-purple/70 shadow-card">
              {query
                ? `Pre „${query}“ sme nič nenašli.`
                : "Zatiaľ žiadny obsah."}
            </div>
          ) : (
            feed.map((item) => {
              if (item.kind === "event") {
                const e = item.event;
                const label = defaultProfileLabel(e.profile);
                return (
                  <div key={`event-${e.id}`}>
                    <FeedProfileHeader
                      profileId={e.profile?.id}
                      isFollowing={
                        e.profile ? followingIds.has(e.profile.id) : false
                      }
                      {...label}
                    />
                    <FeedEventItem
                      id={e.id}
                      title={e.title}
                      description={e.description}
                      startsAt={e.startsAt}
                      location={e.location}
                      coverUrl={e.coverUrl}
                    />
                  </div>
                );
              }

              const p = item.post;
              const label = defaultProfileLabel(p.profile);
              const href =
                p.type === "VIDEO"
                  ? p.videoUrl ?? "#"
                  : p.type === "ARTICLE"
                    ? `/home/articles/${p.id}`
                    : `/home/recipes/${p.id}`;

              return (
                <div key={`post-${p.id}`}>
                  <FeedProfileHeader
                    profileId={p.profile?.id}
                    isFollowing={
                      p.profile ? followingIds.has(p.profile.id) : false
                    }
                    {...label}
                  />
                  <FeedPostItem
                    href={href}
                    type={p.type}
                    title={p.title}
                    excerpt={p.excerpt}
                    coverUrl={p.coverUrl}
                    likeSlot={
                      <LikeButton
                        postId={p.id}
                        liked={likedIds.has(p.id)}
                        count={p._count.likes}
                        variant="feed"
                      />
                    }
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
