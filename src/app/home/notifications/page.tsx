import { FeedHeader } from "@/components/FeedHeader";

export default function NotificationsPage() {
  return (
    <>
      <FeedHeader />
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
