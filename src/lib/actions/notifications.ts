"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionUser, prismaActionError } from "@/lib/safe-action";

export async function markNotificationReadAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;
  const user = auth.user;

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Chýba notifikácia." };

  try {
    await prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { read: true },
    });
  } catch (err) {
    return {
      ok: false,
      message: prismaActionError(err, "Nepodarilo sa označiť notifikáciu."),
    };
  }

  revalidatePath("/home/notifications");
  revalidatePath("/home");
  return { ok: true };
}

export async function markAllNotificationsReadAction(): Promise<{
  ok: boolean;
  message?: string;
}> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;
  const user = auth.user;

  try {
    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
  } catch (err) {
    return {
      ok: false,
      message: prismaActionError(err, "Nepodarilo sa označiť notifikácie."),
    };
  }

  revalidatePath("/home/notifications");
  revalidatePath("/home");
  return { ok: true };
}

export async function openNotificationAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;
  const user = auth.user;

  const id = String(formData.get("id") ?? "");
  const href = String(formData.get("href") ?? "/home/notifications");

  if (id) {
    try {
      await prisma.notification.updateMany({
        where: { id, userId: user.id },
        data: { read: true },
      });
    } catch (err) {
      return {
        ok: false,
        message: prismaActionError(err, "Nepodarilo sa otvoriť notifikáciu."),
      };
    }
  }

  revalidatePath("/home/notifications");
  revalidatePath("/home");
  redirect(href);
}
