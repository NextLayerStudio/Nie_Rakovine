import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const user = await requireUser();
  return (
    <>
      <FeedHeaderWrapper />
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
