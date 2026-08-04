"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { prismaActionError } from "@/lib/safe-action";
import { enforceAuthRateLimit } from "@/lib/rate-limit";
import { queueEventTicketEmail } from "@/lib/email/send";

const ALREADY_REGISTERED_MESSAGE =
  "S týmto e-mailom ste už na toto podujatie zaregistrovaný/á. Lístok vám prišiel na e-mail.";

export type ActionState = { ok: boolean; message?: string; ticketId?: string };

const EMAIL_RE = /^\S+@\S+\.\S+$/;

/** Guest registration from the public landing page — no account required. */
export async function registerGuestForEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const eventId = String(formData.get("eventId") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const consentPrivacy = formData.get("consentPrivacy") === "on";

  if (!eventId) return { ok: false, message: "Chýba podujatie." };
  if (!firstName || !lastName || !email || !phone) {
    return { ok: false, message: "Vyplňte meno, priezvisko, e-mail a telefónne číslo." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Zadajte platný e-mail." };
  }
  if (!consentPrivacy) {
    return { ok: false, message: "Pre registráciu potrebujeme súhlas so spracovaním osobných údajov." };
  }

  const rateLimit = await enforceAuthRateLimit({
    scope: "event-ticket",
    email,
  });
  if (!rateLimit.allowed) {
    return { ok: false, message: rateLimit.message };
  }

  const event = await prisma.event.findFirst({
    where: { id: eventId, published: true },
    select: {
      id: true,
      title: true,
      startsAt: true,
      endsAt: true,
      location: true,
      description: true,
      capacity: true,
      _count: { select: { tickets: true } },
    },
  });
  if (!event) {
    return { ok: false, message: "Podujatie neexistuje." };
  }

  const existingTicket = await prisma.eventTicket.findUnique({
    where: { eventId_email: { eventId, email } },
    select: { id: true },
  });
  if (existingTicket) {
    return { ok: false, message: ALREADY_REGISTERED_MESSAGE };
  }

  if (event.capacity !== null && event._count.tickets >= event.capacity) {
    return { ok: false, message: "Podujatie je plne obsadené." };
  }

  let ticketId: string;
  try {
    const ticket = await prisma.eventTicket.create({
      data: { eventId, firstName, lastName, email, phone, consentPrivacy },
      select: { id: true },
    });
    ticketId = ticket.id;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { ok: false, message: ALREADY_REGISTERED_MESSAGE };
    }
    return {
      ok: false,
      message: prismaActionError(err, "Registrácia zlyhala. Skúste to znova."),
    };
  }

  queueEventTicketEmail({
    email,
    firstName,
    ticketId,
    eventTitle: event.title,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    location: event.location,
    description: event.description,
  });

  revalidatePath("/podujatia");
  revalidatePath(`/podujatia/${eventId}`);
  revalidatePath(`/admin/events/${eventId}`);

  return { ok: true, ticketId };
}

export type CancelTicketState = { ok: boolean; message?: string };

/**
 * Delete a ticket and, when it belongs to a member (userId set), the linked
 * EventRegistration too — a member's ticket and registration are always
 * created and cancelled together so both sides of the app stay in sync.
 * Shared by the public "Odhlásiť sa" flow and the admin attendee list.
 */
export async function deleteEventTicketAndLinkedRegistration(
  ticketId: string,
): Promise<{ ok: true; eventId: string } | { ok: false; message: string }> {
  const ticket = await prisma.eventTicket.findUnique({
    where: { id: ticketId },
    select: { eventId: true, userId: true },
  });
  if (!ticket) {
    return { ok: false, message: "Tento lístok už neexistuje — registrácia bola zrejme už zrušená." };
  }

  await prisma.eventTicket.delete({ where: { id: ticketId } });
  if (ticket.userId) {
    await prisma.eventRegistration.deleteMany({
      where: { eventId: ticket.eventId, userId: ticket.userId },
    });
  }

  return { ok: true, eventId: ticket.eventId };
}

/** Cancel a ticket — reached via the "Odhlásiť sa" link in the ticket e-mail (members and guests alike). */
export async function cancelEventTicketAction(
  _prev: CancelTicketState,
  formData: FormData,
): Promise<CancelTicketState> {
  const ticketId = String(formData.get("ticketId") ?? "");
  if (!ticketId) return { ok: false, message: "Chýba lístok." };

  const result = await deleteEventTicketAndLinkedRegistration(ticketId);
  if (!result.ok) return result;

  revalidatePath("/podujatia");
  revalidatePath(`/podujatia/${result.eventId}`);
  revalidatePath(`/admin/events/${result.eventId}`);
  revalidatePath("/home");
  revalidatePath("/home/calendar");
  revalidatePath("/profile");

  return { ok: true };
}
