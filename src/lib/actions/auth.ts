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
import {
  queueWelcomeEmail,
  trackLoginDevice,
} from "@/lib/email/send";
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
      profile: { create: {} },
    },
  });

  await createSession({ userId: user.id, role: user.role });

  queueWelcomeEmail({ email: user.email, fullName: user.fullName });

  const headerStore = await headers();
  await trackLoginDevice({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    userAgent: headerStore.get("user-agent") ?? "Neznáme zariadenie",
  });

  redirect("/register/subscription");
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

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, message: "Nesprávny e-mail alebo heslo." };
  }

  await createSession({ userId: user.id, role: user.role });

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

// ---------- Reset password (no email step yet, just lets the user set
// a new password if they're logged in) ---------------------------------
export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Vyplňte e-mail a heslo." };
  }
  if (password.length < 6) {
    return { ok: false, message: "Heslo musí mať aspoň 6 znakov." };
  }
  if (password !== confirmPassword) {
    return { ok: false, message: "Heslá sa nezhodujú." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Return success either way so we don't leak which e-mails exist.
    return { ok: true, message: "Ak účet existuje, heslo bolo aktualizované." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(password) },
  });

  return { ok: true, message: "Heslo bolo aktualizované. Môžete sa prihlásiť." };
}
