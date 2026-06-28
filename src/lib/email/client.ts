import "server-only";

import { Resend } from "resend";
import { getEmailFrom, getResendApiKey, isEmailEnabled } from "@/lib/email/config";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = getResendApiKey();
    if (!apiKey) throw new Error("RESEND_API_KEY is not set");
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isEmailEnabled()) {
    console.warn("[email] Skipped — RESEND_API_KEY or EMAIL_FROM not configured");
    return { ok: false, error: "Email not configured" };
  }

  const from = getEmailFrom();
  if (!from) return { ok: false, error: "EMAIL_FROM not configured" };

  try {
    const { error } = await getResend().emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    console.error("[email] Send failed:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Send failed",
    };
  }
}

/** Fire-and-forget — never blocks or throws to the caller. */
export function sendTransactionalEmailAsync(input: {
  to: string;
  subject: string;
  html: string;
}): void {
  void sendTransactionalEmail(input).then((result) => {
    if (!result.ok && result.error !== "Email not configured") {
      console.error("[email] Async send failed:", result.error);
    }
  });
}
