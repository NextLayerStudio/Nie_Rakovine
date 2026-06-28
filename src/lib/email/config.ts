import "server-only";

import { getAppUrlFromEnv } from "@/lib/email/brand";

export { BRAND } from "@/lib/email/brand";

export function getAppUrl(): string {
  return getAppUrlFromEnv(process.env);
}

export function getEmailFrom(): string | null {
  let from = process.env.EMAIL_FROM?.trim();
  if (!from) return null;

  if (
    (from.startsWith('"') && from.endsWith('"')) ||
    (from.startsWith("'") && from.endsWith("'"))
  ) {
    from = from.slice(1, -1).trim();
  } else if (from.startsWith('"') || from.startsWith("'")) {
    from = from.slice(1).trim();
  }

  if (/^[^<]*<[^\s<>]+@[^\s<>]+$/.test(from)) {
    from = `${from}>`;
  }

  const valid =
    /^[^\s<>]+@[^\s<>]+$/.test(from) ||
    /^.+ <[^\s<>]+@[^\s<>]+>$/.test(from);
  if (!valid) {
    console.error(
      "[email] EMAIL_FROM has invalid format. Use: Onko Klub <noreply@domain.sk> or noreply@domain.sk",
    );
    return null;
  }

  return from;
}

export function getResendApiKey(): string | null {
  return (
    process.env.RESEND_API_KEY?.trim() ||
    process.env.RESEND_API_KEY_ONKO?.trim() ||
    null
  );
}

export function isEmailEnabled(): boolean {
  return Boolean(getResendApiKey() && getEmailFrom());
}
