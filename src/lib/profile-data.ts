"use server";

import { prisma } from "@/lib/prisma";
import { isEventRegistrationComplete } from "@/lib/event-payment";

export async function loadProfileCalendarData(userId: string, fullName: string) {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId, event: { published: true } },
    orderBy: { event: { startsAt: "asc" } },
    select: {
      paymentStatus: true,
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          coverUrl: true,
          startsAt: true,
          endsAt: true,
          location: true,
          capacity: true,
          isPaid: true,
          priceCents: true,
          currency: true,
          _count: { select: { registrations: true } },
        },
      },
    },
  });

  return {
    ok: true as const,
    defaultName: nameParts[0] ?? "",
    defaultSurname: nameParts.slice(1).join(" "),
    registeredEvents: registrations
      .filter((r) => isEventRegistrationComplete(r, r.event.isPaid))
      .map((r) => ({
        id: r.event.id,
        title: r.event.title,
        description: r.event.description,
        coverUrl: r.event.coverUrl,
        startsAt: r.event.startsAt.toISOString(),
        endsAt: r.event.endsAt?.toISOString() ?? null,
        location: r.event.location,
        registrationCount: r.event._count.registrations,
        capacity: r.event.capacity,
        isPaid: r.event.isPaid,
        priceCents: r.event.priceCents,
        currency: r.event.currency,
      })),
  };
}
