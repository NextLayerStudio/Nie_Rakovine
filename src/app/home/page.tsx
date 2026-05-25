import { FeedHeader, FeedTabs } from "@/components/FeedHeader";
import { PostCard } from "@/components/PostCard";

// Home - videos feed (matches "Domov videá")
export default function HomeVideosPage() {
  return (
    <>
      <FeedHeader />
      <FeedTabs active="videos" />

      <section className="pt-1">
        <PostCard
          kind="video"
          title="Joga pre ženy počas onkologickej liečby"
          meta="ONKO YOGA · 12 min"
          ctaLabel="Pozrieť video"
          bg="linear-gradient(180deg, #f3c3a2 0%, #d98c80 100%)"
          href="/home/events/yoga"
        />
        <PostCard
          kind="video"
          title="Ako si zachovať pokoj počas chemoterapie"
          meta="ONKO PSYCH · 8 min"
          ctaLabel="Pozrieť video"
          bg="linear-gradient(180deg, #f7d5e0 0%, #ca6a8a 100%)"
        />
      </section>
    </>
  );
}
