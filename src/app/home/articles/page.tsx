import { FeedHeader, FeedTabs } from "@/components/FeedHeader";
import { PostCard } from "@/components/PostCard";

export default function HomeArticlesPage() {
  return (
    <>
      <FeedHeader />
      <FeedTabs active="articles" />

      <section className="pt-1">
        <PostCard
          kind="article"
          title="Čo robiť po skončení liečby - sprievodca prvými 100 dňami"
          meta="5 min čítania"
          ctaLabel="Prečítať"
          bg="linear-gradient(180deg, #f5e0c8 0%, #d8a079 100%)"
        />
        <PostCard
          kind="article"
          title="Komunita ako podpora: ako si nájsť svojich ľudí"
          meta="3 min čítania"
          ctaLabel="Prečítať"
          bg="linear-gradient(180deg, #f7d5e0 0%, #ca6a8a 100%)"
        />
      </section>
    </>
  );
}
