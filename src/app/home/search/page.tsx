import { FeedHeader } from "@/components/FeedHeader";

export default function SearchPage() {
  return (
    <>
      <FeedHeader />
      <section className="mx-4">
        <input
          type="search"
          placeholder="Hľadať obsah…"
          className="input-light"
        />
        <p className="mt-4 text-center text-xs text-brand-purple/70">
          Začnite písať a hľadajte v článkoch, receptoch a videách.
        </p>
      </section>
    </>
  );
}
