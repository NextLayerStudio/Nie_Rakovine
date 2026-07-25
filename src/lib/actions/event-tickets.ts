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

  if (!eventId) return { ok: false, message: "Chýba podujatie." };
  if (!firstName || !lastName || !email || !phone) {
    return { ok: false, message: "Vyplňte meno, priezvisko, e-mail a telefónne číslo." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Zadajte platný e-mail." };
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
      _count: { select: { registrations: true, tickets: true } },
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

  const totalRegistered =
    event._count.registrations + event._count.tickets;
  if (event.capacity !== null && totalRegistered >= event.capacity) {
    return { ok: false, message: "Podujatie je plne obsadené." };
  }

  let ticketId: string;
  try {
    const ticket = await prisma.eventTicket.create({
      data: { eventId, firstName, lastName, email, phone },
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
