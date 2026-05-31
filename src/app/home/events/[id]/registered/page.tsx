import Link from "next/link";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EventRegisteredPage() {
  const user = await requireUser();
  return (
    <>
      <FeedHeaderWrapper />
      <div className="mx-4 rounded-3xl bg-brand-purple p-6 text-center text-white shadow-card">
        <h2 className="text-lg font-bold">Ďakujeme za registráciu!</h2>
        <p className="mt-2 text-xs text-white/90">
          Detaily k podujatiu Vám pošleme na email.
        </p>
        <Link
          href="/home"
          className="mt-6 inline-block rounded-pill bg-white px-6 py-2 text-sm font-semibold text-brand-purple"
        >
          Späť domov
        </Link>
      </div>
    </>
  );
}
