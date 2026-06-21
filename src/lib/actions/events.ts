"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { EventCategory } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserForAction, requireAdmin } from "@/lib/auth";
import { prismaActionError, requireActionUser } from "@/lib/safe-action";
import { notifyNearbyUsersNewEvent } from "@/lib/notifications";
import { EVENT_CATEGORIES } from "@/lib/event-category";
import { parseCancerTypes } from "@/lib/cancer-type";

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

// ------ Admin: create / edit / delete -----------------------------------
export async function createEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const startsAtStr = String(formData.get("startsAt") ?? "");
  const endsAtStr = String(formData.get("endsAt") ?? "");
  const location = String(formData.get("location") ?? "").trim() || null;
  const capacityStr = String(formData.get("capacity") ?? "");
  const coverUrl = String(formData.get("coverUrl") ?? "").trim() || null;

  if (!title || !startsAtStr) {
    return { ok: false, message: "Vyplňte aspoň názov a čas začiatku." };
  }

  const profileId = String(formData.get("profileId") ?? "").trim() || null;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      category: parseCategory(formData),
      startsAt: new Date(startsAtStr),
      endsAt: endsAtStr ? new Date(endsAtStr) : null,
      location,
      latitude: parseCoord(formData, "latitude"),
      longitude: parseCoord(formData, "longitude"),
      capacity: capacityStr ? Number(capacityStr) : null,
      coverUrl,
      profileId,
      cancerTypes: parseCancerTypes(formData.getAll("cancerTypes")),
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
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Chýba identifikátor." };

  const title = String(formData.get("title") ?? "").trim();
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const startsAtStr = String(formData.get("startsAt") ?? "");
  const endsAtStr = String(formData.get("endsAt") ?? "");
  const location = String(formData.get("location") ?? "").trim() || null;
  const capacityStr = String(formData.get("capacity") ?? "");
  const coverUrl = String(formData.get("coverUrl") ?? "").trim() || null;
  const published = formData.get("published") === "on";

  const profileId = String(formData.get("profileId") ?? "").trim() || null;

  await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      category: parseCategory(formData),
      startsAt: new Date(startsAtStr),
      endsAt: endsAtStr ? new Date(endsAtStr) : null,
      location,
      latitude: parseCoord(formData, "latitude"),
      longitude: parseCoord(formData, "longitude"),
      capacity: capacityStr ? Number(capacityStr) : null,
      coverUrl,
      published,
      profileId,
      cancerTypes: parseCancerTypes(formData.getAll("cancerTypes")),
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
  const user = auth.user;

  const eventId = String(formData.get("eventId") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;
  const surname = String(formData.get("surname") ?? "").trim() || null;
  if (!eventId) return { ok: false, message: "Chýba podujatie." };

  const event = await prisma.event.findFirst({
    where: { id: eventId, published: true },
    select: {
      capacity: true,
      _count: { select: { registrations: true } },
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
    event._count.registrations >= event.capacity
  ) {
    return { ok: false, message: "Podujatie je plne obsadené." };
  }

  try {
    await prisma.eventRegistration.upsert({
      where: { eventId_userId: { eventId, userId: user.id } },
      create: { eventId, userId: user.id, name, surname },
      update: { name, surname },
    });
  } catch (err) {
    return {
      ok: false,
      message: prismaActionError(err, "Registrácia zlyhala. Skúste to znova."),
    };
  }

  revalidatePath(`/home/events/${eventId}`);
  revalidatePath("/home");
  revalidatePath("/home/calendar");
  revalidatePath("/profile");

  if (formData.get("stayOnPage") === "1") {
    return { ok: true };
  }

  redirect(`/home/events/${eventId}/registered`);
}
