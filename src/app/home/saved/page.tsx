import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { FeedPostItem } from "@/components/FeedPostItem";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { buildPostGallery, postPublicHref } from "@/lib/post-display";
import { feedPostSelect } from "@/lib/feed-queries";

export const dynamic = "force-dynamic";

export default async function SavedPostsPage() {
  const user = await requireUser();

  const saved = await prisma.savedPost.findMany({
    where: { userId: user.id, post: { published: true } },
    orderBy: { createdAt: "desc" },
    take: 60,
    select: {
      post: { select: feedPostSelect },
    },
  });

  const posts = saved.map((s) => s.post);

  const likedSet = posts.length
    ? new Set(
        (await prisma.articleLike.findMany({
          where: { userId: user.id, postId: { in: posts.map((p) => p.id) } },
          select: { postId: true },
        })).map((l) => l.postId),
      )
    : new Set<string>();

  return (
    <>
      <FeedHeaderWrapper />

      <div className="px-5 pt-2 pb-4">
        <h1 className="text-sm font-bold uppercase tracking-wide text-brand-purple">
          Uložené
        </h1>
        <p className="mt-0.5 text-xs text-brand-purple/60">
          {posts.length === 0 ? "Zatiaľ nič uložené." : `${posts.length} uložených príspevkov`}
        </p>
      </div>

      <section>
        {posts.map((p) => (
          <FeedPostItem
            key={p.id}
            postId={p.id}
            href={postPublicHref(p)}
            type={p.type}
            title={p.title}
            excerpt={p.excerpt}
            imageUrls={buildPostGallery(p.coverUrl, p.images)}
            videoUrl={p.videoUrl ?? null}
            liked={likedSet.has(p.id)}
            likeCount={p._count.likes}
            saved={true}
          />
        ))}
      </section>
    </>
  );
}
