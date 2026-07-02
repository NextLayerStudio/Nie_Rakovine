import "server-only";

import { prisma } from "@/lib/prisma";
import { generateNumericCode, hashToken } from "@/lib/tokens";
import { sendTransactionalEmail } from "@/lib/email/client";
import { renderVerificationCodeEmail } from "@/lib/email/templates/verification-code";

export const VERIFICATION_CODE_TTL_MIN = 15;
export const VERIFICATION_MAX_ATTEMPTS = 5;
export const VERIFICATION_RESEND_COOLDOWN_SEC = 60;

/** Invalidate any previous codes, create a fresh one, and email it. */
export async function createAndSendVerificationCode(input: {
  userId: string;
  email: string;
  fullName: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const code = generateNumericCode(6);
  const codeHash = hashToken(code);
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MIN * 60_000);

  await prisma.emailVerificationCode.updateMany({
    where: { userId: input.userId, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  await prisma.emailVerificationCode.create({
    data: { userId: input.userId, codeHash, expiresAt },
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`[verification] Code for ${input.email}: ${code}`);
  }

  return sendTransactionalEmail({
    to: input.email,
    subject: "Overovací kód do Onko Klubu",
    html: renderVerificationCodeEmail({
      fullName: input.fullName,
      code,
      ttlMinutes: VERIFICATION_CODE_TTL_MIN,
    }),
  });
}

type VerifyResult = { ok: true } | { ok: false; message: string };

/** Check a submitted code, marking the user verified on success. */
export async function verifyEmailCode(
  userId: string,
  rawCode: string,
): Promise<VerifyResult> {
  const code = rawCode.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, message: "Zadajte 6-miestny kód." };
  }

  const record = await prisma.emailVerificationCode.findFirst({
    where: { userId, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return { ok: false, message: "Kód sa nenašiel. Požiadajte o nový." };
  }
  if (record.expiresAt.getTime() < Date.now()) {
    return { ok: false, message: "Platnosť kódu vypršala. Požiadajte o nový." };
  }
  if (record.attempts >= VERIFICATION_MAX_ATTEMPTS) {
    return {
      ok: false,
      message: "Priveľa nesprávnych pokusov. Požiadajte o nový kód.",
    };
  }

  if (hashToken(code) !== record.codeHash) {
    await prisma.emailVerificationCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, message: "Nesprávny kód. Skúste to znova." };
  }

  await prisma.$transaction([
    prisma.emailVerificationCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    }),
  ]);

  return { ok: true };
}

/** Timestamp of the most recent code — used to enforce a resend cooldown. */
export async function lastVerificationSentAt(
  userId: string,
): Promise<Date | null> {
  const last = await prisma.emailVerificationCode.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
  return last?.createdAt ?? null;
}
