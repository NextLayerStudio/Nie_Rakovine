import { FeedHeader, FeedTabs } from "@/components/FeedHeader";
import { PostCard } from "@/components/PostCard";

export default function HomeRecipesPage() {
  return (
    <>
      <FeedHeader />
      <FeedTabs active="recipes" />

      <section className="pt-1">
        <PostCard
          kind="recipe"
          title="Vyživujúci paradajkový vývar s bazalkou"
          meta="30 min"
          ctaLabel="Recept"
          bg="linear-gradient(180deg, #ffcdb2 0%, #e07a5f 100%)"
        />
        <PostCard
          kind="recipe"
          title="Quinoa misa s pečeným cíceronom a tahini"
          meta="25 min"
          ctaLabel="Recept"
          bg="linear-gradient(180deg, #f6d6c2 0%, #b08968 100%)"
        />
      </section>
    </>
  );
}
