import "server-only";

import { prisma } from "@/lib/prisma";

export type RegistrationHistoryItem = {
  id: string;
  eventId: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  coverUrl: string | null;
  registeredAt: string;
  published: boolean;
};

export function subscriptionPlanInfo(
  plan: string,
  status: string,
): { label: string; active: boolean } {
  const active = status === "ACTIVE";
  if (!active) return { label: "Neaktívne predplatné", active: false };
  switch (plan) {
    case "FREE":
      return { label: "Free členstvo", active: true };
    case "MONTHLY":
      return { label: "Mesačné predplatné", active: true };
    case "YEARLY":
      return { label: "Ročné predplatné", active: true };
    case "SUPPORTER":
      return { label: "Podporujúce členstvo", active: true };
    case "TRIAL":
      return { label: "Skúšobné obdobie", active: true };
    default:
      return { label: "Bez predplatného", active: false };
  }
}

export async function loadRegistrationHistory(
  userId: string,
): Promise<RegistrationHistoryItem[]> {
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId },
    orderBy: { event: { startsAt: "desc" } },
    select: {
      id: true,
      createdAt: true,
      event: {
        select: {
          id: true,
          title: true,
          startsAt: true,
          endsAt: true,
          location: true,
          coverUrl: true,
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
    registeredAt: r.createdAt.toISOString(),
    published: r.event.published,
  }));
}
