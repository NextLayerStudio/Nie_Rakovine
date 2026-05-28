import Link from "next/link";
import { FeedHeader } from "@/components/FeedHeader";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const user = await requireUser();
  const events = await prisma.event.findMany({
    where: { published: true, startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
  });

  return (
    <>
      <FeedHeader name={user.fullName} />
      <section className="mx-4 space-y-3">
        <h2 className="px-1 text-base font-bold text-brand-purple">Kalendár</h2>

        {events.length === 0 ? (
          <div className="card p-5 text-xs text-brand-purple/70">
            Žiadne pripravované podujatia.
          </div>
        ) : (
          events.map((event) => (
            <Link
              key={event.id}
              href={`/home/events/${event.id}`}
              className="block rounded-3xl bg-white p-4 shadow-card"
            >
              <p className="text-[11px] font-medium uppercase text-brand-pink">
                {new Intl.DateTimeFormat("sk-SK", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(event.startsAt)}
              </p>
              <p className="mt-1 text-sm font-bold text-brand-purple">
                {event.title}
              </p>
              {event.location && (
                <p className="text-xs text-brand-purple/70">{event.location}</p>
              )}
            </Link>
          ))
        )}
      </section>
    </>
  );
}
