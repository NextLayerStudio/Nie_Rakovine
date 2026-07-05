import "server-only";

import type { EventPaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type RegistrationHistoryItem = {
  id: string;
  eventId: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  coverUrl: string | null;
  isPaid: boolean;
  paymentStatus: EventPaymentStatus;
  registeredAt: string;
  published: boolean;
};

export async function loadRegistrationHistory(
  userId: string,
): Promise<RegistrationHistoryItem[]> {
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId },
    orderBy: { event: { startsAt: "desc" } },
    select: {
      id: true,
      createdAt: true,
      paymentStatus: true,
      event: {
        select: {
          id: true,
          title: true,
          startsAt: true,
          endsAt: true,
          location: true,
          coverUrl: true,
          isPaid: true,
          published: true,
        },
      },
    },
  });

  return registrations.map((r) => ({
    id: r.id,
    eventId: r.event.id,
    title: r.event.title,
    startsAt: r.event.startsAt.toISOString(),
    endsAt: r.event.endsAt?.toISOString() ?? null,
    location: r.event.location,
    coverUrl: r.event.coverUrl,
    isPaid: r.event.isPaid,
    paymentStatus: r.paymentStatus,
    registeredAt: r.createdAt.toISOString(),
    published: r.event.published,
  }));
}
