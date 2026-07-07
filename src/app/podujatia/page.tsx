import Link from "next/link";
import type { EventCategory } from "@prisma/client";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PublicEventsExplorer } from "@/components/landing/PublicEventsExplorer";
import type { PublicEvent } from "@/components/landing/EventCard";
import { prisma } from "@/lib/prisma";
import { EVENT_CATEGORY_FILTER_OPTIONS } from "@/lib/event-category";

export const dynamic = "force-dynamic";

function buildHref(category: string) {
  return category ? `/podujatia?category=${category}` : "/podujatia";
}

export default async function PodujatiaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryParam } = await searchParams;
  const category = (EVENT_CATEGORY_FILTER_OPTIONS.some((c) => c.value === categoryParam)
    ? categoryParam
    : "") as EventCategory | "";

  const events = await prisma.event.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      coverUrl: true,
      location: true,
      startsAt: true,
      endsAt: true,
      capacity: true,
      visibility: true,
      _count: { select: { registrations: true, tickets: true } },
    },
  });

  const publicEvents: PublicEvent[] = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    category: e.category,
    coverUrl: e.coverUrl,
    location: e.location,
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt ? e.endsAt.toISOString() : null,
    capacity: e.capacity,
    visibility: e.visibility,
    registrationCount: e._count.registrations + e._count.tickets,
  }));

  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      <section className="pt-24 pb-5">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-black text-[#6F2380] md:text-2xl">
              Podujatia ONKO KLUBU
            </h1>
            <span className="text-xs font-semibold text-[#6F2380]/50">
              {publicEvents.length} {publicEvents.length === 1 ? "podujatie" : "podujatí"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {EVENT_CATEGORY_FILTER_OPTIONS.map((c) => {
              const active = c.value === category;
              return (
                <Link
                  key={c.value || "all"}
                  href={buildHref(c.value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-[#6F2380] text-white"
                      : "bg-white text-[#6F2380]/70 ring-1 ring-[#6F2380]/15 hover:ring-[#FDA4C7]/50"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <PublicEventsExplorer events={publicEvents} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
