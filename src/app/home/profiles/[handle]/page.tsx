import Link from "next/link";
import { notFound } from "next/navigation";
import { FollowProfileButton } from "@/components/FollowProfileButton";
import { ProfilePostGrid } from "@/components/profile/ProfilePostGrid";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { postCoverFallback, safeReturnHref } from "@/lib/post-display";
import type { PostType } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ClubProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const user = await requireUser();
  const { handle } = await params;
  const { from } = await searchParams;
  const backHref = safeReturnHref(from, "/home/profiles");

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
            select: { url: true },
          },
          _count: { select: { images: true } },
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

  const gridPosts = profile.posts.map((post) => ({
    id: post.id,
    type: post.type as PostType,
    title: post.title,
    coverUrl: post.coverUrl ?? post.images[0]?.url ?? null,
    fallback: postCoverFallback(post.type as PostType),
    imageCount: post._count.images,
  }));

  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* Top nav */}
      <div className="flex h-12 items-center gap-3 border-b border-brand-purple/10 px-4">
        <Link href={backHref} className="grid h-8 w-8 shrink-0 place-items-center">
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
      <ProfilePostGrid posts={gridPosts} />
    </div>
  );
}
