import { FeedTabs } from "@/components/FeedHeader";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { LikeButton } from "@/components/LikeButton";
import { PostCard } from "@/components/PostCard";
import { buildPostGallery, postPublicHref } from "@/lib/post-display";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomeRecipesPage() {
  const user = await requireUser();
  const recipes = await prisma.post.findMany({
    where: { type: "RECIPE", published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      _count: { select: { likes: true } },
    },
  });

  const userLikes = await prisma.articleLike.findMany({
    where: {
      userId: user.id,
      postId: { in: recipes.map((r) => r.id) },
    },
    select: { postId: true },
  });
  const likedIds = new Set(userLikes.map((l) => l.postId));

  return (
    <>
      <FeedHeaderWrapper />
      <FeedTabs active="recipes" />

      <section className="pt-1">
        {recipes.length === 0 ? (
          <div className="mx-4 rounded-3xl bg-white p-6 text-center text-xs text-brand-purple/70 shadow-card">
            Žiadne recepty zatiaľ nie sú publikované.
          </div>
        ) : (
          recipes.map((r) => (
            <PostCard
              key={r.id}
              href={postPublicHref(r)}
              type={r.type}
              title={r.title}
              excerpt={r.excerpt}
              imageUrls={buildPostGallery(r.coverUrl, r.images)}
              likeSlot={
                <LikeButton
                  postId={r.id}
                  liked={likedIds.has(r.id)}
                  count={r._count.likes}
                />
              }
            />
          ))
        )}
      </section>
    </>
  );
}
