import "server-only";

/**
 * MailerLite newsletter sync — fired whenever a member has consentNewsletter
 * on (at registration, or later toggled on in Nastavenia → Notifikácie).
 * Per spec: check first whether the email is already a subscriber, only
 * add them if it's genuinely new. Never throws — a MailerLite outage must
 * never break registration or settings saving for the member.
 */

const MAILERLITE_API_URL = "https://connect.mailerlite.com/api";
// "ONKO KLUB - Newsletter" group, created 2026-08-02.
const NEWSLETTER_GROUP_ID = "194714969344837281";

function apiKey(): string | undefined {
  return process.env.MAILERLITE_API_KEY?.trim() || undefined;
}

async function mailerliteFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const key = apiKey();
  if (!key) throw new Error("MAILERLITE_API_KEY is not set");
  return fetch(`${MAILERLITE_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init?.headers,
    },
  });
}

async function subscriberExists(email: string): Promise<boolean> {
  const res = await mailerliteFetch(`/subscribers/${encodeURIComponent(email)}`);
  if (res.status === 404) return false;
  if (!res.ok) {
    throw new Error(`MailerLite lookup failed (${res.status})`);
  }
  return true;
}

export async function addNewsletterSubscriber(input: {
  email: string;
  fullName?: string;
}): Promise<void> {
  if (!apiKey()) {
    console.error("[mailerlite] MAILERLITE_API_KEY not set — skipping sync");
    return;
  }

  try {
    const alreadySubscribed = await subscriberExists(input.email);
    if (alreadySubscribed) return;

    const res = await mailerliteFetch("/subscribers", {
      method: "POST",
      body: JSON.stringify({
        email: input.email,
        groups: [NEWSLETTER_GROUP_ID],
        fields: input.fullName ? { name: input.fullName } : undefined,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[mailerlite] failed to add subscriber", res.status, body);
    }
  } catch (err) {
    console.error("[mailerlite] error syncing subscriber", err);
  }
}
