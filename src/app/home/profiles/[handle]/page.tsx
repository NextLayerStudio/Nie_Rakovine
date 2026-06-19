import Link from "next/link";
import { notFound } from "next/navigation";
import { FollowProfileButton } from "@/components/FollowProfileButton";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { postPublicHref, postCoverFallback } from "@/lib/post-display";
import type { PostType } from "@prisma/client";

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
      _count: {
        select: {
          followers: true,
          posts: { where: { published: true } },
        },
      },
      posts: {
        where: { published: true },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 60,
        select: {
          id: true,
          type: true,
          title: true,
          coverUrl: true,
          videoUrl: true,
          images: {
            orderBy: { sortOrder: "asc" as const },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
  });

  if (!profile) notFound();

  const isFollowing = !!(await prisma.profileFollow.findUnique({
    where: { userId_profileId: { userId: user.id, profileId: profile.id } },
  }));

  const avatarStyle = profile.avatarUrl
    ? { backgroundImage: `url(${profile.avatarUrl})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : { background: "linear-gradient(135deg, #f5c4d0 0%, #6F2380 100%)" };

  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* Top nav */}
      <div className="flex h-12 items-center gap-3 border-b border-brand-purple/10 px-4">
        <Link href="/home/profiles" className="grid h-8 w-8 shrink-0 place-items-center">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-purple" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <span className="flex-1 truncate text-center text-sm font-bold text-brand-purple">
          @{profile.handle}
        </span>
        <div className="h-8 w-8 shrink-0" />
      </div>

      {/* Profile header */}
      <div className="px-4 pb-4 pt-5">
        {/* Avatar + stats row */}
        <div className="flex items-center gap-6">
          <div
            className="h-20 w-20 shrink-0 rounded-full ring-2 ring-brand-purple/10"
            style={avatarStyle}
          />
          <div className="flex flex-1 justify-around">
            <div className="text-center">
              <p className="text-lg font-bold leading-tight text-brand-purple">
                {profile._count.posts}
              </p>
              <p className="text-xs text-brand-purple/50">príspevkov</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold leading-tight text-brand-purple">
                {profile._count.followers}
              </p>
              <p className="text-xs text-brand-purple/50">sledujúcich</p>
            </div>
          </div>
        </div>

        {/* Name + bio */}
        <div className="mt-3">
          <p className="text-sm font-bold text-brand-purple">{profile.displayName}</p>
          {profile.bio && (
            <p className="mt-1 text-sm leading-relaxed text-brand-purple/80">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Follow button */}
        <div className="mt-3">
          <FollowProfileButton
            profileId={profile.id}
            handle={profile.handle}
            isFollowing={isFollowing}
            fullWidth
          />
        </div>
      </div>

      {/* Tab bar — grid only for now */}
      <div className="flex border-y border-brand-purple/10">
        <div className="flex flex-1 items-center justify-center py-2.5 border-b-2 border-brand-purple">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-purple" fill="currentColor" aria-hidden>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
      </div>

      {/* Posts grid */}
      {profile.posts.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-16 text-sm text-brand-purple/50">
          Zatiaľ žiadne príspevky.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-px bg-brand-purple/10">
          {profile.posts.map((post) => {
            const cover = post.coverUrl ?? post.images[0]?.url ?? null;
            const fallback = postCoverFallback(post.type as PostType);
            return (
              <Link
                key={post.id}
                href={postPublicHref(post)}
                className="relative aspect-square overflow-hidden"
              >
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full" style={{ background: fallback }} />
                )}

                {/* Type overlay icon */}
                {post.type === "VIDEO" && (
                  <div className="absolute right-1.5 top-1.5">
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-black/50">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 translate-x-px text-white" fill="currentColor" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
                {post.type === "ARTICLE" && (
                  <div className="absolute right-1.5 top-1.5">
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-black/50">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M4 6h16M4 10h16M4 14h10" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                )}
                {post.type === "RECIPE" && (
                  <div className="absolute right-1.5 top-1.5">
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-black/50">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M12 2v7m0 0c0-3.5-4-5-4-5m4 5c0-3.5 4-5 4-5M5 9h14l-1.5 11H6.5L5 9z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                )}
                {post.type === "PHOTO" && post.images.length > 1 && (
                  <div className="absolute right-1.5 top-1.5">
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-black/50">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <rect x="5" y="5" width="14" height="14" rx="2" />
                        <rect x="2" y="2" width="14" height="14" rx="2" />
                      </svg>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
