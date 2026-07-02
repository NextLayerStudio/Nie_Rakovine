import "server-only";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { generateToken, hashToken } from "@/lib/tokens";
import { sendTransactionalEmail } from "@/lib/email/client";
import { getAppUrl } from "@/lib/email/config";
import { renderPasswordResetEmail } from "@/lib/email/templates/password-reset";

export const PASSWORD_RESET_TTL_MIN = 30;

/** Invalidate previous tokens, create a fresh one, and email the reset link. */
export async function sendPasswordResetLink(input: {
  userId: string;
  email: string;
  fullName: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = generateToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MIN * 60_000);

  await prisma.passwordResetToken.updateMany({
    where: { userId: input.userId, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  await prisma.passwordResetToken.create({
    data: { userId: input.userId, tokenHash, expiresAt },
  });

  const url = `${getAppUrl()}/reset-password/${token}`;

  if (process.env.NODE_ENV !== "production") {
    console.log(`[password-reset] Link for ${input.email}: ${url}`);
  }

  return sendTransactionalEmail({
    to: input.email,
    subject: "Zmena hesla do Onko Klubu",
    html: renderPasswordResetEmail({
      fullName: input.fullName,
      url,
      ttlMinutes: PASSWORD_RESET_TTL_MIN,
    }),
  });
}

/** Read-only check for the token page (does not consume the token). */
export async function isPasswordResetTokenValid(
  rawToken: string,
): Promise<boolean> {
  if (!rawToken) return false;
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
  });
  return Boolean(
    record && !record.consumedAt && record.expiresAt.getTime() >= Date.now(),
  );
}

type ResetResult = { ok: true } | { ok: false; message: string };

/** Validate + consume the token and set the new password (single use). */
export async function resetPasswordWithToken(
  rawToken: string,
  newPassword: string,
): Promise<ResetResult> {
  if (!rawToken) {
    return { ok: false, message: "Neplatný odkaz." };
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
  });

  if (!record || record.consumedAt || record.expiresAt.getTime() < Date.now()) {
    return {
      ok: false,
      message:
        "Odkaz je neplatný alebo jeho platnosť vypršala. Požiadajte o nový.",
    };
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    }),
  ]);

  return { ok: true };
}
