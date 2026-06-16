import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { LikeButton } from "@/components/LikeButton";
import { PostImageCarousel } from "@/components/PostImageCarousel";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import {
  buildPostGallery,
  isEmbeddableVideo,
  isLocalMedia,
  postKindLabel,
} from "@/lib/post-display";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const post = await prisma.post.findFirst({
    where: { id, published: true },
    include: {
      profile: true,
      images: { orderBy: { sortOrder: "asc" } },
      _count: { select: { likes: true } },
    },
  });

  if (!post) notFound();

  const like = await prisma.articleLike.findUnique({
    where: { userId_postId: { userId: user.id, postId: post.id } },
  });

  const gallery = buildPostGallery(post.coverUrl, post.images);

  return (
    <>
      <FeedHeaderWrapper />

      <article className="px-5 pb-24 pt-2">
        <Link
          href={post.profile ? `/home/profiles/${post.profile.handle}` : "/home"}
          className="text-xs font-semibold text-brand-purple"
        >
          ← Späť
        </Link>

        <div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-card">
          <div className="flex items-center justify-between px-4 pt-4">
            <span className="rounded-pill bg-brand-purple/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-purple">
              {postKindLabel(post.type)}
            </span>
            {post.profile && (
              <span className="text-xs font-medium text-brand-purple/60">
                {post.profile.displayName}
              </span>
            )}
          </div>

          {post.type === "VIDEO" && post.videoUrl ? (
            <VideoBlock url={post.videoUrl} coverUrl={post.coverUrl} />
          ) : (
            <div className="mt-3 px-4">
              <PostImageCarousel
                images={gallery}
                type={post.type}
                aspectClass="aspect-[4/3]"
                maxHeightClass=""
                showDots={gallery.length > 1}
              />
            </div>
          )}

          <div className="px-4 py-4">
            <h1 className="text-lg font-bold leading-snug text-brand-purple">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-2 text-sm leading-relaxed text-brand-purple/75">
                {post.excerpt}
              </p>
            )}
            {post.body && (
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-brand-purple/90">
                {post.body}
              </div>
            )}
            <div className="mt-5 border-t border-brand-purple/10 pt-4">
              <LikeButton
                postId={post.id}
                liked={!!like}
                count={post._count.likes}
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

function VideoBlock({
  url,
  coverUrl,
}: {
  url: string;
  coverUrl: string | null;
}) {
  if (isLocalMedia(url) || url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov")) {
    return (
      <div className="mt-3 bg-black">
        <video
          src={url}
          controls
          playsInline
          poster={coverUrl ?? undefined}
          className="aspect-video w-full"
        />
      </div>
    );
  }

  if (isEmbeddableVideo(url)) {
    return (
      <div className="mt-3 px-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex aspect-video items-center justify-center rounded-2xl bg-brand-purple/5 text-sm font-semibold text-brand-purple"
          style={
            coverUrl
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${coverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          Prehrať video ↗
        </a>
      </div>
    );
  }

  return (
    <div className="mt-3 px-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl bg-brand-pink px-4 py-3 text-center text-sm font-semibold text-white"
      >
        Otvoriť video
      </a>
    </div>
  );
}
