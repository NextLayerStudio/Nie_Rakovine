import { Suspense } from "react";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { ContentLibrary } from "@/components/library/ContentLibrary";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function LibrarySkeleton() {
  return (
    <div className="space-y-4 px-4 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse h-24 rounded-2xl bg-brand-purple/10" />
      ))}
    </div>
  );
}

export default async function ContentLibraryPage() {
  await requireUser();

  return (
    <>
      <FeedHeaderWrapper />
      <Suspense fallback={<LibrarySkeleton />}>
        <ContentLibrary />
      </Suspense>
    </>
  );
}
