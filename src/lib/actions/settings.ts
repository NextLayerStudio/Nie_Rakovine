"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword, requireUser, verifyPassword } from "@/lib/auth";

export type SettingsActionState = { ok: boolean; message?: string };

export async function changePasswordAction(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { ok: false, message: "Vyplňte všetky polia." };
  }
  if (newPassword.length < 6) {
    return { ok: false, message: "Nové heslo musí mať aspoň 6 znakov." };
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, message: "Nové heslá sa nezhodujú." };
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (
    !dbUser ||
    !(await verifyPassword(currentPassword, dbUser.passwordHash))
  ) {
    return { ok: false, message: "Súčasné heslo nie je správne." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  revalidatePath("/menu/nastavenia");
  return { ok: true, message: "Heslo bolo úspešne zmenené." };
}

export async function updateAccountAction(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (!fullName) {
    return { ok: false, message: "Zadajte meno a priezvisko." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { fullName },
  });

  revalidatePath("/menu/nastavenia");
  revalidatePath("/profile");
  revalidatePath("/menu");
  return { ok: true, message: "Meno bolo uložené." };
}

export async function updatePreferencesAction(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();
  const consentNewsletter = formData.get("consentNewsletter") === "on";
  const notifyNewPosts = formData.get("notifyNewPosts") === "on";
  const notifyForumApproved = formData.get("notifyForumApproved") === "on";
  const notifyForumReactions = formData.get("notifyForumReactions") === "on";
  const notifyEventsNearby = formData.get("notifyEventsNearby") === "on";
  const radiusRaw = Number(formData.get("notifyRadiusKm"));
  const notifyRadiusKm = Number.isFinite(radiusRaw)
    ? Math.min(200, Math.max(10, Math.round(radiusRaw)))
    : 50;

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      consentNewsletter,
      notifyRadiusKm,
      notifyNewPosts,
      notifyForumApproved,
      notifyForumReactions,
      notifyEventsNearby,
    },
    update: {
      consentNewsletter,
      notifyRadiusKm,
      notifyNewPosts,
      notifyForumApproved,
      notifyForumReactions,
      notifyEventsNearby,
    },
  });

  revalidatePath("/menu/nastavenia");
  revalidatePath("/profile");
  return { ok: true, message: "Notifikácie boli uložené." };
}
