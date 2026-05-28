"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";

export type ActionState = { ok: boolean; message?: string };

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

  await prisma.event.create({
    data: {
      title,
      description,
      startsAt: new Date(startsAtStr),
      endsAt: endsAtStr ? new Date(endsAtStr) : null,
      location,
      capacity: capacityStr ? Number(capacityStr) : null,
      coverUrl,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/home");
  revalidatePath("/home/calendar");
  redirect("/admin/events");
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

  await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      startsAt: new Date(startsAtStr),
      endsAt: endsAtStr ? new Date(endsAtStr) : null,
      location,
      capacity: capacityStr ? Number(capacityStr) : null,
      coverUrl,
      published,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/home");
  revalidatePath("/home/calendar");
  redirect("/admin/events");
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

// ------ Public: sign up for an event ------------------------------------
export async function registerForEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const eventId = String(formData.get("eventId") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;
  const surname = String(formData.get("surname") ?? "").trim() || null;
  if (!eventId) return { ok: false, message: "Chýba podujatie." };

  await prisma.eventRegistration.upsert({
    where: { eventId_userId: { eventId, userId: user.id } },
    create: { eventId, userId: user.id, name, surname },
    update: { name, surname },
  });

  revalidatePath(`/home/events/${eventId}`);
  redirect(`/home/events/${eventId}/registered`);
}
