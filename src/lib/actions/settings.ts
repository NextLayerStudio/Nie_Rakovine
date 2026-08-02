"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { destroySession, requireUser } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email/client";
import { renderAccountDeletedEmail } from "@/lib/email/templates/account-deleted";
import { enforceAuthRateLimit } from "@/lib/rate-limit";
import { sendPasswordResetLink } from "@/lib/password-reset";
import { addNewsletterSubscriber } from "@/lib/mailerlite";

export type SettingsActionState = { ok: boolean; message?: string };

function emailFailureMessage(error: string): string {
  if (
    error === "Email not configured" ||
    error === "EMAIL_FROM not configured"
  ) {
    return "E-mailová služba nie je nakonfigurovaná na serveri. Skontrolujte RESEND_API_KEY a EMAIL_FROM vo Vercel.";
  }
  return "E-mail sa nepodarilo odoslať. Skúste to znova o chvíľu.";
}

// Secure change: e-mail a one-time, time-limited link (30 min) instead of
// letting the password be changed directly in the form.
export async function requestPasswordChangeLinkAction(
  _prev: SettingsActionState,
  _formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();

  const rateLimit = await enforceAuthRateLimit({
    scope: "reset-password",
    email: user.email,
  });
  if (!rateLimit.allowed) {
    return { ok: false, message: rateLimit.message };
  }

  try {
    const result = await sendPasswordResetLink({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
    });
    if (!result.ok) {
      console.error("Password change email failed:", result.error);
      return { ok: false, message: emailFailureMessage(result.error) };
    }
  } catch (error) {
    console.error("Failed to send password change link:", error);
    return {
      ok: false,
      message: "Odkaz sa nepodarilo odoslať. Skúste to znova.",
    };
  }

  return {
    ok: true,
    message:
      "Poslali sme vám e-mail s odkazom na zmenu hesla. Odkaz je platný 30 minút.",
  };
}

export async function updateAccountAction(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const fullName = `${firstName} ${lastName}`.trim();

  if (!firstName || !lastName) {
    return { ok: false, message: "Zadajte meno a priezvisko." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { fullName, firstName, lastName },
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

  if (consentNewsletter) {
    await addNewsletterSubscriber({ email: user.email, fullName: user.fullName });
  }

  revalidatePath("/menu/nastavenia");
  revalidatePath("/profile");
  return { ok: true, message: "Notifikácie boli uložené." };
}

const TRIAL_DAYS = 14;

export async function startFreeTrialAction(
  _prev: SettingsActionState,
  _formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();

  if (user.trialUsedAt) {
    return {
      ok: false,
      message: "Skúšobné obdobie ste už niekedy využili — je dostupné len raz.",
    };
  }

  if (
    user.subscriptionStatus === "ACTIVE" &&
    ["MONTHLY", "YEARLY", "SUPPORTER", "TRIAL"].includes(user.subscriptionPlan)
  ) {
    return {
      ok: false,
      message: "Už máte aktívny prístup k plateným výhodám.",
    };
  }

  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + TRIAL_DAYS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionPlan: "TRIAL",
      subscriptionStatus: "ACTIVE",
      subscriptionStart: now,
      subscriptionEnd: end,
      trialUsedAt: now,
    },
  });

  revalidatePath("/menu/nastavenia/predplatne");
  revalidatePath("/menu/nastavenia");
  return { ok: true, message: `Skúšobné obdobie je aktívne do ${end.toLocaleDateString("sk-SK")}.` };
}

export async function deleteAccountAction(): Promise<void> {
  const user = await requireUser();

  const emailResult = await sendTransactionalEmail({
    to: user.email,
    subject: "Váš účet v Onko Klube bol zrušený",
    html: renderAccountDeletedEmail({ fullName: user.fullName }),
  });

  if (!emailResult.ok) {
    console.error("Account deletion email failed:", emailResult.error);
  }

  await prisma.user.delete({ where: { id: user.id } });
  await destroySession();
  revalidatePath("/");
  redirect("/welcome");
}
