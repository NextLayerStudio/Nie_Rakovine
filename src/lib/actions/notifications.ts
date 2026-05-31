"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function markNotificationReadAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { read: true },
  });

  revalidatePath("/home/notifications");
  revalidatePath("/home");
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const user = await requireUser();

  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/home/notifications");
  revalidatePath("/home");
}

export async function openNotificationAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const href = String(formData.get("href") ?? "/home/notifications");

  if (id) {
    await prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { read: true },
    });
  }

  revalidatePath("/home/notifications");
  revalidatePath("/home");
  redirect(href);
}
