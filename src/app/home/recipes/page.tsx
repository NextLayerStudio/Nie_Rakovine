import { FeedHeader, FeedTabs } from "@/components/FeedHeader";
import { PostCard } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomeRecipesPage() {
  const user = await requireUser();
  const recipes = await prisma.post.findMany({
    where: { type: "RECIPE", published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <FeedHeader name={user.fullName} />
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
              href={`/home/recipes/${r.id}`}
              type={r.type}
              title={r.title}
              excerpt={r.excerpt}
              coverUrl={r.coverUrl}
            />
          ))
        )}
      </section>
    </>
  );
}
