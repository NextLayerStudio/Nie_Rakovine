import { FeedHeader } from "@/components/FeedHeader";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requireUser();
  return (
    <>
      <FeedHeader name={user.fullName} />
      <section className="mx-4">
        <div className="card p-5">
          <h2 className="text-base font-bold text-brand-purple">Notifikácie</h2>
          <p className="mt-2 text-xs text-brand-purple/70">
            Žiadne nové notifikácie.
          </p>
        </div>
      </section>
    </>
  );
}
