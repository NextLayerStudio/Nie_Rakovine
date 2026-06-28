/**
 * Send the welcome email template to a test inbox.
 * Usage: npm run email:welcome -- you@email.sk
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resend } from "resend";
import { renderWelcomeEmail } from "../src/lib/email/templates/welcome";

function loadEnvFile() {
  const path = resolve(process.cwd(), ".env");
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    } else if (val.startsWith('"') || val.startsWith("'")) {
      val = val.slice(1);
    }
    if (/^[^<]*<[^\s<>]+@[^\s<>]+$/.test(val)) val = `${val}>`;
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main() {
  loadEnvFile();
  const apiKey =
    process.env.RESEND_API_KEY?.trim() ||
    process.env.RESEND_API_KEY_ONKO?.trim();
  let from = process.env.EMAIL_FROM?.trim() ?? "";
  if (from.startsWith('"') || from.startsWith("'")) from = from.slice(1);
  if (/^[^<]*<[^\s<>]+@[^\s<>]+$/.test(from)) from = `${from}>`;

  const to =
    process.argv[2]?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.TEST_EMAIL?.trim();

  if (!apiKey || !from || !to) {
    console.error("Need RESEND_API_KEY, EMAIL_FROM, and a recipient email.");
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Vitajte v Onko Klube ♡",
    html: renderWelcomeEmail("Peter"),
  });

  if (error) {
    console.error("Send failed:", error.message);
    process.exit(1);
  }

  console.log(`Welcome email sent to ${to} (id: ${data?.id ?? "ok"})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
