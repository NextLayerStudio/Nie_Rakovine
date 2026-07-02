"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  createAndSendVerificationCode,
  lastVerificationSentAt,
  verifyEmailCode,
  VERIFICATION_RESEND_COOLDOWN_SEC,
} from "@/lib/email-verification";
import { queueWelcomeEmail } from "@/lib/email/send";

export type ActionState = {
  ok: boolean;
  message?: string;
  redirectTo?: string;
};

export async function verifyEmailCodeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      message: "Vaše prihlásenie vypršalo. Prihláste sa znova.",
    };
  }
  if (user.emailVerified) {
    return { ok: true, redirectTo: "/register/subscription" };
  }

  const code = String(formData.get("code") ?? "");
  const result = await verifyEmailCode(user.id, code);
  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  // E-mail confirmed — welcome them now that the address is real.
  queueWelcomeEmail({ email: user.email, fullName: user.fullName });

  return { ok: true, redirectTo: "/register/subscription" };
}

export async function resendVerificationCodeAction(
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      message: "Vaše prihlásenie vypršalo. Prihláste sa znova.",
    };
  }
  if (user.emailVerified) {
    return { ok: true, redirectTo: "/register/subscription" };
  }

  const last = await lastVerificationSentAt(user.id);
  if (last) {
    const elapsed = Date.now() - last.getTime();
    const cooldownMs = VERIFICATION_RESEND_COOLDOWN_SEC * 1000;
    if (elapsed < cooldownMs) {
      const wait = Math.ceil((cooldownMs - elapsed) / 1000);
      return {
        ok: false,
        message: `Počkajte ${wait} s pred odoslaním nového kódu.`,
      };
    }
  }

  const emailResult = await createAndSendVerificationCode({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
  });
  if (!emailResult.ok) {
    console.error("Failed to resend verification code:", emailResult.error);
    return {
      ok: false,
      message:
        emailResult.error === "Email not configured" ||
        emailResult.error === "EMAIL_FROM not configured"
          ? "E-mailová služba nie je nakonfigurovaná na serveri."
          : "Nepodarilo sa odoslať kód. Skúste to znova.",
    };
  }

  return { ok: true, message: "Nový kód sme odoslali na váš e-mail." };
}
