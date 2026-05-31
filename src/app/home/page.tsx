import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { FeedProfileHeader } from "@/components/FeedProfileHeader";
import { LikeButton } from "@/components/LikeButton";
import { EventCard, PostCard } from "@/components/PostCard";
import { buildHomeFeed, defaultProfileLabel } from "@/lib/feed";
import { relevantWhere } from "@/lib/cancer-personalization";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomeFeedPage() {
  const user = await requireUser();
  const userTypes = user.profile?.cancerTypes ?? [];
  const relevant = relevantWhere(userTypes);

  const [posts, events] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, ...relevant },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        profile: true,
        _count: { select: { likes: true } },
      },
    }),
    prisma.event.findMany({
      where: { published: true, ...relevant },
      orderBy: { startsAt: "desc" },
      take: 20,
      include: { profile: true },
    }),
  ]);

  const profileIds = [
    ...new Set(
      [
        ...posts.map((p) => p.profileId),
        ...events.map((e) => e.profileId),
      ].filter((id): id is string => !!id),
    ),
  ];

  const [userLikes, follows] = await Promise.all([
    prisma.articleLike.findMany({
      where: {
        userId: user.id,
        postId: { in: posts.map((p) => p.id) },
      },
      select: { postId: true },
    }),
    prisma.profileFollow.findMany({
      where: { userId: user.id, profileId: { in: profileIds } },
      select: { profileId: true },
    }),
  ]);

  const likedIds = new Set(userLikes.map((l) => l.postId));
  const followingIds = new Set(follows.map((f) => f.profileId));

  const feed = buildHomeFeed(posts, events, userTypes);

  return (
    <>
      <FeedHeaderWrapper />

      <section className="pt-1">
        {feed.length === 0 ? (
          <EmptyState message="Zatiaľ žiadny obsah. Admin môže pridať príspevky v profiloch." />
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
                  <EventCard
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
                <PostCard
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
                    />
                  }
                />
              </div>
            );
          })
        )}
      </section>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mx-4 rounded-3xl bg-white p-6 text-center text-xs text-brand-purple/70 shadow-card">
      {message}
    </div>
  );
}
