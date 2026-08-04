"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { EventCategory, EventRegion, EventVisibility } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { prismaActionError, requireActionUser } from "@/lib/safe-action";
import { notifyNearbyUsersNewEvent } from "@/lib/notifications";
import { EVENT_CATEGORIES } from "@/lib/event-category";
import { EVENT_REGIONS } from "@/lib/event-region";
import { parseCancerTypes } from "@/lib/cancer-type";
import { isPremiumMember } from "@/lib/membership";
import { resolveImageField } from "@/lib/uploads";
import { parseZonedDateTime } from "@/lib/timezone";
import { queueEventTicketEmail } from "@/lib/email/send";
import { deleteEventTicketAndLinkedRegistration } from "@/lib/actions/event-tickets";

export type ActionState = { ok: boolean; message?: string };

function parseCategory(formData: FormData): EventCategory | null {
  const raw = String(formData.get("category") ?? "").trim();
  return (EVENT_CATEGORIES as string[]).includes(raw)
    ? (raw as EventCategory)
    : null;
}

function parseCoord(formData: FormData, name: string): number | null {
  const raw = String(formData.get(name) ?? "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function parseVisibility(formData: FormData): EventVisibility {
  const raw = String(formData.get("visibility") ?? "").trim();
  return raw === "MEMBERS_ONLY" ? "MEMBERS_ONLY" : "PUBLIC";
}

function parseRegion(formData: FormData): EventRegion | null {
  const raw = String(formData.get("region") ?? "").trim();
  return (EVENT_REGIONS as string[]).includes(raw) ? (raw as EventRegion) : null;
}

// ------ Admin: create / edit / delete -----------------------------------
export async function createEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const startsAtStr = String(formData.get("startsAt") ?? "");
  const endsAtStr = String(formData.get("endsAt") ?? "");
  const location = String(formData.get("location") ?? "").trim() || null;
  const capacityStr = String(formData.get("capacity") ?? "");

  let coverUrl: string | null;
  try {
    coverUrl = await resolveImageField(
      formData,
      "coverFile",
      "coverUrl",
      "events",
      admin.id,
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať obrázok.",
    };
  }

  if (!title || !startsAtStr) {
    return { ok: false, message: "Vyplňte aspoň názov a čas začiatku." };
  }

  const profileId = String(formData.get("profileId") ?? "").trim() || null;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      category: parseCategory(formData),
      startsAt: parseZonedDateTime(startsAtStr),
      endsAt: endsAtStr ? parseZonedDateTime(endsAtStr) : null,
      location,
      latitude: parseCoord(formData, "latitude"),
      longitude: parseCoord(formData, "longitude"),
      capacity: capacityStr ? Number(capacityStr) : null,
      coverUrl,
      profileId,
      cancerTypes: parseCancerTypes(formData.getAll("cancerTypes")),
      visibility: parseVisibility(formData),
      region: parseRegion(formData),
    },
  });

  await notifyNearbyUsersNewEvent(event);

  revalidateEventPaths(profileId);
  redirect(profileId ? `/admin/profiles/${profileId}` : "/admin/profiles");
}

export async function updateEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Chýba identifikátor." };

  const title = String(formData.get("title") ?? "").trim();
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const startsAtStr = String(formData.get("startsAt") ?? "");
  const endsAtStr = String(formData.get("endsAt") ?? "");
  const location = String(formData.get("location") ?? "").trim() || null;
  const capacityStr = String(formData.get("capacity") ?? "");
  const published = formData.get("published") === "on";

  let coverUrl: string | null;
  try {
    coverUrl = await resolveImageField(
      formData,
      "coverFile",
      "coverUrl",
      "events",
      admin.id,
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať obrázok.",
    };
  }

  const profileId = String(formData.get("profileId") ?? "").trim() || null;

  await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      category: parseCategory(formData),
      startsAt: parseZonedDateTime(startsAtStr),
      endsAt: endsAtStr ? parseZonedDateTime(endsAtStr) : null,
      location,
      latitude: parseCoord(formData, "latitude"),
      longitude: parseCoord(formData, "longitude"),
      capacity: capacityStr ? Number(capacityStr) : null,
      coverUrl,
      published,
      profileId,
      cancerTypes: parseCancerTypes(formData.getAll("cancerTypes")),
      visibility: parseVisibility(formData),
      region: parseRegion(formData),
    },
  });

  revalidateEventPaths(profileId);
  redirect(profileId ? `/admin/profiles/${profileId}` : "/admin/profiles");
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const event = await prisma.event.findUnique({
    where: { id },
    select: { profileId: true },
  });
  await prisma.event.delete({ where: { id } });
  revalidateEventPaths(event?.profileId ?? null);
  redirect(
    event?.profileId
      ? `/admin/profiles/${event.profileId}`
      : "/admin/profiles",
  );
}

export async function removeEventAttendeeAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const eventId = String(formData.get("eventId") ?? "");
  if (!id || !eventId) return;

  await deleteEventTicketAndLinkedRegistration(id);

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/home");
  revalidatePath("/home/calendar");
  revalidatePath("/profile");
}

export type CancelRegistrationState = { ok: boolean; message?: string };

/**
 * Cancel a member's own registration — reached via the "Odhlásiť sa" link in
 * emails sent before the unified ticket flow. Kept working for old emails
 * already in people's inboxes; new confirmation e-mails link to the ticket
 * cancel flow instead (see `cancelEventTicketAction`), which this mirrors by
 * also removing the linked ticket so both stay in sync either way.
 */
export async function cancelEventRegistrationAction(
  _prev: CancelRegistrationState,
  formData: FormData,
): Promise<CancelRegistrationState> {
  const registrationId = String(formData.get("registrationId") ?? "");
  if (!registrationId) return { ok: false, message: "Chýba registrácia." };

  const registration = await prisma.eventRegistration.findUnique({
    where: { id: registrationId },
    select: { eventId: true, userId: true },
  });
  if (!registration) {
    return { ok: false, message: "Táto registrácia už neexistuje — bola zrejme už zrušená." };
  }

  await prisma.eventRegistration.delete({ where: { id: registrationId } });
  await prisma.eventTicket.deleteMany({
    where: { eventId: registration.eventId, userId: registration.userId },
  });

  revalidatePath("/home");
  revalidatePath("/home/calendar");
  revalidatePath(`/home/events/${registration.eventId}`);
  revalidatePath(`/podujatia/${registration.eventId}`);
  revalidatePath(`/admin/events/${registration.eventId}`);
  revalidatePath("/profile");

  return { ok: true };
}

function revalidateEventPaths(profileId: string | null) {
  revalidatePath("/admin/profiles");
  if (profileId) revalidatePath(`/admin/profiles/${profileId}`);
  revalidatePath("/home");
  revalidatePath("/home/calendar");
}

// ------ Public: sign up for an event ------------------------------------
export async function registerForEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false, message: auth.message };
  const sessionUser = auth.user;

  const eventId = String(formData.get("eventId") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;
  const surname = String(formData.get("surname") ?? "").trim() || null;
  if (!eventId) return { ok: false, message: "Chýba podujatie." };

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
    },
  });
  if (!user) return { ok: false, message: "Prihláste sa prosím znova." };

  if (!isPremiumMember(user.subscriptionPlan, user.subscriptionStatus)) {
    return {
      ok: false,
      message:
        "Prihlasovanie na podujatia je dostupné len pre platiacich členov.",
    };
  }

  const event = await prisma.event.findFirst({
    where: { id: eventId, published: true },
    select: {
      title: true,
      startsAt: true,
      endsAt: true,
      location: true,
      description: true,
      capacity: true,
      _count: { select: { tickets: true } },
    },
  });
  if (!event) return { ok: false, message: "Podujatie neexistuje." };

  const alreadyRegistered = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
    select: { id: true },
  });

  if (
    !alreadyRegistered &&
    event.capacity !== null &&
    event._count.tickets >= event.capacity
  ) {
    return { ok: false, message: "Podujatie je plne obsadené." };
  }

  const wasAlreadyRegistered = Boolean(alreadyRegistered);

  try {
    await prisma.eventRegistration.upsert({
      where: { eventId_userId: { eventId, userId: user.id } },
      create: { eventId, userId: user.id, name, surname },
      update: { name, surname },
      select: { id: true },
    });
  } catch (err) {
    return {
      ok: false,
      message: prismaActionError(err, "Registrácia zlyhala. Skúste to znova."),
    };
  }

  // Every attendee (member or guest) gets a ticket — it's what drives the
  // QR code / listok page and the unified "Odhlásiť sa" cancel flow.
  const [derivedFirstName, ...derivedRest] = user.fullName.trim().split(/\s+/);
  const ticketFirstName = name ?? derivedFirstName ?? user.fullName;
  const ticketLastName = surname ?? derivedRest.join(" ");

  const ticket = await prisma.eventTicket.upsert({
    where: { eventId_email: { eventId, email: user.email } },
    create: {
      eventId,
      userId: user.id,
      firstName: ticketFirstName,
      lastName: ticketLastName,
      email: user.email,
      consentPrivacy: true,
    },
    update: {
      userId: user.id,
      firstName: ticketFirstName,
      lastName: ticketLastName,
    },
    select: { id: true },
  });

  if (!wasAlreadyRegistered) {
    queueEventTicketEmail({
      email: user.email,
      firstName: ticketFirstName,
      ticketId: ticket.id,
      eventTitle: event.title,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      location: event.location,
      description: event.description,
    });
  }

  revalidatePath(`/home/events/${eventId}`);
  revalidatePath(`/podujatia/${eventId}`);
  revalidatePath("/home");
  revalidatePath("/home/calendar");
  revalidatePath("/profile");

  if (formData.get("stayOnPage") === "1") {
    return { ok: true };
  }

  redirect(`/home/events/${eventId}/registered`);
}
