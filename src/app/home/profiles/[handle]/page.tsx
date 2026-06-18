import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { FollowProfileButton } from "@/components/FollowProfileButton";
import { LikeButton } from "@/components/LikeButton";
import { EventCard, PostCard } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { buildPostGallery, postPublicHref } from "@/lib/post-display";
import {
  PROFILE_EVENT_LIMIT,
  PROFILE_POST_LIMIT,
  listPostSelect,
} from "@/lib/feed-queries";

export const dynamic = "force-dynamic";

export default async function ClubProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const user = await requireUser();
  const { handle } = await params;

  const profile = await prisma.clubProfile.findFirst({
    where: { handle, published: true },
    select: {
      id: true,
      handle: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      posts: {
        where: { published: true },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: PROFILE_POST_LIMIT,
        select: listPostSelect,
      },
      events: {
        where: { published: true },
        orderBy: { startsAt: "asc" },
        take: PROFILE_EVENT_LIMIT,
        select: {
          id: true,
          title: true,
          description: true,
          startsAt: true,
          location: true,
          coverUrl: true,
        },
      },
    },
  });

  if (!profile) notFound();

  const postIds = profile.posts.map((p) => p.id);

  const [follow, userLikes] = await Promise.all([
    prisma.profileFollow.findUnique({
      where: {
        userId_profileId: { userId: user.id, profileId: profile.id },
      },
    }),
    postIds.length
      ? prisma.articleLike.findMany({
          where: {
            userId: user.id,
            postId: { in: postIds },
          },
          select: { postId: true },
        })
      : [],
  ]);
  const likedIds = new Set(userLikes.map((l) => l.postId));

  const coverStyle = profile.coverUrl
    ? {
        backgroundImage: `url(${profile.coverUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : {
        background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)",
      };

  return (
    <>
      <FeedHeaderWrapper />

      <div className="px-5 pb-24">
        <Link
          href="/home/profiles"
          className="text-xs font-semibold text-brand-purple"
        >
          ← Profily
        </Link>

        <div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-card">
          <div className="h-28 w-full" style={coverStyle} />
          <div className="relative px-4 pb-4">
            <div
              className="-mt-10 h-20 w-20 rounded-full border-4 border-white bg-cover bg-center shadow-card"
              style={
                profile.avatarUrl
                  ? { backgroundImage: `url(${profile.avatarUrl})` }
                  : {
                      background:
                        "linear-gradient(135deg, #f5c4d0 0%, #6F2380 100%)",
                    }
              }
            />
            <div className="mt-2 flex items-start justify-between gap-2">
              <div>
                <h1 className="text-lg font-bold text-brand-purple">
                  {profile.displayName}
                </h1>
                <p className="text-xs text-brand-purple/60">
                  @{profile.handle}
                </p>
              </div>
              <FollowProfileButton
                profileId={profile.id}
                handle={profile.handle}
                isFollowing={!!follow}
              />
            </div>
            {profile.bio && (
              <p className="mt-2 text-sm leading-relaxed text-brand-purple/85">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {profile.events.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wide text-brand-purple/70">
              Podujatia
            </h2>
            <div className="-mx-4 mt-2">
              {profile.events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  startsAt={event.startsAt}
                  location={event.location}
                  coverUrl={event.coverUrl}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-brand-purple/70">
            Príspevky
          </h2>
          <div className="-mx-4 mt-2">
            {profile.posts.length === 0 ? (
              <div className="mx-4 rounded-3xl bg-white p-6 text-center text-xs text-brand-purple/70 shadow-card">
                Zatiaľ žiadny obsah.
              </div>
            ) : (
              profile.posts.map((post) => (
                <PostCard
                  key={post.id}
                  href={postPublicHref(post)}
                  type={post.type}
                  title={post.title}
                  excerpt={post.excerpt}
                  imageUrls={buildPostGallery(post.coverUrl, post.images)}
                  likeSlot={
                    <LikeButton
                      postId={post.id}
                      liked={likedIds.has(post.id)}
                      count={post._count.likes}
                    />
                  }
                />
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}
