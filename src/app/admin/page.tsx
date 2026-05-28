import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [eventCount, postCount, userCount, upcomingEvent] = await Promise.all([
    prisma.event.count(),
    prisma.post.count(),
    prisma.user.count(),
    prisma.event.findFirst({
      where: { published: true, startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      include: { _count: { select: { registrations: true } } },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Prehľad</h1>
      <p className="mt-2 text-sm text-brand-purple/70">
        Vitajte v administrácii ONKO KLUBU.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Podujatia" value={eventCount} />
        <Stat label="Obsah" value={postCount} />
        <Stat label="Používatelia" value={userCount} />
      </div>

      {upcomingEvent && (
        <div className="mt-6 rounded-2xl border border-brand-purple/10 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-purple/60">
            Najbližšie podujatie
          </p>
          <h2 className="mt-1 text-lg font-bold">{upcomingEvent.title}</h2>
          <p className="mt-1 text-sm text-brand-purple/70">
            {new Intl.DateTimeFormat("sk-SK", {
              dateStyle: "long",
              timeStyle: "short",
            }).format(upcomingEvent.startsAt)}{" "}
            · {upcomingEvent._count.registrations} registrácií
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminCard
          href="/admin/events"
          title="Podujatia"
          description="Vytvorte a spravujte podujatia (napr. ONKO YOGA)."
        />
        <AdminCard
          href="/admin/posts"
          title="Obsah"
          description="Pridávajte videá, články a recepty pre členov."
        />
        <AdminCard
          href="/admin/users"
          title="Používatelia"
          description="Prehľad registrovaných členov a ich predplatného."
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-brand-purple/10 bg-white p-4 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-purple/60">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function AdminCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-brand-purple/10 bg-white p-5 shadow-card transition hover:border-brand-purple/30"
    >
      <h2 className="text-base font-bold">{title}</h2>
      <p className="mt-1 text-xs text-brand-purple/70">{description}</p>
    </Link>
  );
}
