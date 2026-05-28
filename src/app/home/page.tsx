import { FeedHeader, FeedTabs } from "@/components/FeedHeader";
import { EventCard, PostCard } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomeVideosPage() {
  const user = await requireUser();

  const [videos, upcomingEvents] = await Promise.all([
    prisma.post.findMany({
      where: { type: "VIDEO", published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.event.findMany({
      where: { published: true, startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 3,
    }),
  ]);

  return (
    <>
      <FeedHeader name={user.fullName} />
      <FeedTabs active="videos" />

      <section className="pt-1">
        {upcomingEvents.map((event) => (
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

        {videos.length === 0 && upcomingEvents.length === 0 ? (
          <EmptyState message="Žiadne videá zatiaľ nie sú publikované." />
        ) : (
          videos.map((v) => (
            <PostCard
              key={v.id}
              href={v.videoUrl ?? "#"}
              type={v.type}
              title={v.title}
              excerpt={v.excerpt}
              coverUrl={v.coverUrl}
            />
          ))
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
