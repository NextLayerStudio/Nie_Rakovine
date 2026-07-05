"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { trackLoginDevice } from "@/lib/email/send";
import { createAndSendVerificationCode } from "@/lib/email-verification";
import {
  resetPasswordWithToken,
  sendPasswordResetLink,
} from "@/lib/password-reset";
import { enforceAuthRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export type ActionState = {
  ok: boolean;
  message?: string;
  /** Set after successful login — client navigates here (session cookie is already set). */
  redirectTo?: string;
};

// ---------- Register ----------------------------------------------------
export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const birthDateRaw = String(formData.get("birthDate") ?? "");

  if (!fullName || !email || !password) {
    return { ok: false, message: "Vyplňte všetky polia." };
  }
  if (password.length < 6) {
    return { ok: false, message: "Heslo musí mať aspoň 6 znakov." };
  }
  if (password !== confirmPassword) {
    return { ok: false, message: "Heslá sa nezhodujú." };
  }

  const rateLimit = await enforceAuthRateLimit({ scope: "register", email });
  if (!rateLimit.allowed) {
    return { ok: false, message: rateLimit.message };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, message: "Účet s týmto e-mailom už existuje." };
  }

  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      passwordHash: await hashPassword(password),
      birthDate: birthDateRaw ? new Date(birthDateRaw) : null,
      // emailVerified defaults to false — the user must confirm the code next.
      profile: { create: {} },
    },
  });

  // Log the user in so the verification step can identify them, but the
  // emailVerified gate (see requireUser) blocks the rest of the app until
  // the emailed code is confirmed.
  await createSession({ userId: user.id, role: user.role });

  const emailResult = await createAndSendVerificationCode({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
  });
  if (!emailResult.ok) {
    console.error(
      "Failed to send verification code during register:",
      emailResult.error,
    );
    await destroySession();
    await prisma.user.delete({ where: { id: user.id } });
    return {
      ok: false,
      message:
        emailResult.error === "Email not configured" ||
        emailResult.error === "EMAIL_FROM not configured"
          ? "E-mailová služba nie je nakonfigurovaná. Kontaktujte podporu."
          : "Nepodarilo sa odoslať overovací kód. Skúste registráciu znova.",
    };
  }

  return { ok: true, redirectTo: "/register/verify-email" };
}

// ---------- Login -------------------------------------------------------
export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Zadajte e-mail aj heslo." };
  }

  const rateLimit = await enforceAuthRateLimit({ scope: "login", email });
  if (!rateLimit.allowed) {
    return { ok: false, message: rateLimit.message };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, message: "Nesprávny e-mail alebo heslo." };
  }

  await createSession({ userId: user.id, role: user.role });

  // Unverified accounts (registration abandoned before the code step) must
  // finish e-mail verification before they can use the app.
  if (!user.emailVerified) {
    const emailResult = await createAndSendVerificationCode({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
    });
    if (!emailResult.ok) {
      console.error(
        "Failed to resend verification code during login:",
        emailResult.error,
      );
    }
    return { ok: true, redirectTo: "/register/verify-email" };
  }

  const headerStore = await headers();
  await trackLoginDevice({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    userAgent: headerStore.get("user-agent") ?? "Neznáme zariadenie",
  });

  const redirectTo =
    next && next.startsWith("/")
      ? next
      : user.role === "ADMIN"
        ? "/admin"
        : "/home";

  // Client-side navigation is more reliable with useActionState than throw redirect().
  return { ok: true, redirectTo };
}

// ---------- Logout ------------------------------------------------------
export async function logoutAction(): Promise<void> {
  await destroySession();
  revalidatePath("/");
  redirect("/welcome");
}

// ---------- Forgot password: e-mail a one-time reset link ---------------
export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { ok: false, message: "Zadajte e-mail." };
  }

  const rateLimit = await enforceAuthRateLimit({
    scope: "reset-password",
    email,
  });
  if (!rateLimit.allowed) {
    return { ok: false, message: rateLimit.message };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const result = await sendPasswordResetLink({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
    });
    if (!result.ok) {
      console.error("Failed to send password reset link:", result.error);
    }
  }

  // Always return success so we don't leak which e-mails have accounts.
  return {
    ok: true,
    message:
      "Ak účet s týmto e-mailom existuje, poslali sme naň odkaz na zmenu hesla. Skontrolujte si schránku.",
  };
}

// ---------- Set a new password from a valid reset token -----------------
export async function setNewPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!password) {
    return { ok: false, message: "Zadajte nové heslo." };
  }
  if (password.length < 6) {
    return { ok: false, message: "Heslo musí mať aspoň 6 znakov." };
  }
  if (password !== confirmPassword) {
    return { ok: false, message: "Heslá sa nezhodujú." };
  }

  const result = await resetPasswordWithToken(token, password);
  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  return {
    ok: true,
    redirectTo: "/login",
    message: "Heslo bolo zmenené. Prihláste sa novým heslom.",
  };
}
