import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { CalendarView, type CalendarEvent } from "@/components/calendar/CalendarView";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { distanceKm } from "@/lib/geo";
import { relevantWhere } from "@/lib/cancer-personalization";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const user = await requireUser();
  const userTypes = user.profile?.cancerTypes ?? [];

  const [events, registrations] = await Promise.all([
    prisma.event.findMany({
      where: { published: true, ...relevantWhere(userTypes) },
      orderBy: { startsAt: "asc" },
      include: { profile: { select: { displayName: true, handle: true } } },
    }),
    prisma.eventRegistration.findMany({
      where: { userId: user.id },
      select: { eventId: true },
    }),
  ]);

  const registeredIds = new Set(registrations.map((r) => r.eventId));
  const me = {
    latitude: user.profile?.latitude ?? null,
    longitude: user.profile?.longitude ?? null,
  };

  const calendarEvents: CalendarEvent[] = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    location: e.location,
    coverUrl: e.coverUrl,
    category: e.category,
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt ? e.endsAt.toISOString() : null,
    profileName: e.profile?.displayName ?? "ONKO KLUB",
    registered: registeredIds.has(e.id),
    distanceKm: distanceKm(me, e),
  }));

  return (
    <>
      <FeedHeaderWrapper />
      <CalendarView
        events={calendarEvents}
        hasLocation={me.latitude !== null && me.longitude !== null}
        radiusKm={user.profile?.notifyRadiusKm ?? 50}
      />
    </>
  );
}
