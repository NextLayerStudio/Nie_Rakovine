import { FeedTabs } from "@/components/FeedHeader";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { LikeButton } from "@/components/LikeButton";
import { PostCard } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { buildPostGallery, postPublicHref } from "@/lib/post-display";

export const dynamic = "force-dynamic";

export default async function HomeArticlesPage() {
  const user = await requireUser();
  const articles = await prisma.post.findMany({
    where: { type: "ARTICLE", published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      _count: { select: { likes: true } },
    },
  });

  const userLikes = await prisma.articleLike.findMany({
    where: {
      userId: user.id,
      postId: { in: articles.map((a) => a.id) },
    },
    select: { postId: true },
  });
  const likedIds = new Set(userLikes.map((l) => l.postId));

  return (
    <>
      <FeedHeaderWrapper />
      <FeedTabs active="articles" />

      <section className="pt-1">
        {articles.length === 0 ? (
          <div className="mx-4 rounded-3xl bg-white p-6 text-center text-xs text-brand-purple/70 shadow-card">
            Žiadne články zatiaľ nie sú publikované.
          </div>
        ) : (
          articles.map((a) => (
            <PostCard
              key={a.id}
              href={postPublicHref(a)}
              type={a.type}
              title={a.title}
              excerpt={a.excerpt}
              imageUrls={buildPostGallery(a.coverUrl, a.images)}
              likeSlot={
                <LikeButton
                  postId={a.id}
                  liked={likedIds.has(a.id)}
                  count={a._count.likes}
                />
              }
            />
          ))
        )}
      </section>
    </>
  );
}
