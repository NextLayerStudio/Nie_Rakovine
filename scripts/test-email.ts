/**
 * Send a test email to verify Resend + .env configuration.
 * Usage: npm run email:test
 * Optional: npm run email:test -- you@email.sk
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resend } from "resend";

function loadEnvFile() {
  const path = resolve(process.cwd(), ".env");
  try {
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
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.error("Could not read .env file.");
    process.exit(1);
  }
}

function getResendApiKey(): string | null {
  return (
    process.env.RESEND_API_KEY?.trim() ||
    process.env.RESEND_API_KEY_ONKO?.trim() ||
    null
  );
}

function normalizeEmailFrom(raw: string): string | null {
  let from = raw.trim();
  if (
    (from.startsWith('"') && from.endsWith('"')) ||
    (from.startsWith("'") && from.endsWith("'"))
  ) {
    from = from.slice(1, -1).trim();
  } else if (from.startsWith('"') || from.startsWith("'")) {
    from = from.slice(1).trim();
  }
  if (/^[^<]*<[^\s<>]+@[^\s<>]+$/.test(from)) from = `${from}>`;
  const valid =
    /^[^\s<>]+@[^\s<>]+$/.test(from) ||
    /^.+ <[^\s<>]+@[^\s<>]+>$/.test(from);
  return valid ? from : null;
}

function checkConfig() {
  const apiKey = getResendApiKey();
  const from = normalizeEmailFrom(process.env.EMAIL_FROM ?? "");
  const appUrl = process.env.APP_URL?.trim() || "http://localhost:3000";

  if (!apiKey) {
    console.error("Missing RESEND_API_KEY (or RESEND_API_KEY_ONKO) in .env");
    process.exit(1);
  }
  if (!from) {
    console.error("Missing or invalid EMAIL_FROM in .env");
    console.error('Use: EMAIL_FROM="Onko Klub <info@onkoklub.sk>"');
    process.exit(1);
  }

  return { apiKey, from, appUrl };
}

async function main() {
  loadEnvFile();
  const { apiKey, from, appUrl } = checkConfig();
  const to =
    process.argv[2]?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.TEST_EMAIL?.trim();

  if (!to) {
    console.error(
      "Provide recipient: npm run email:test -- you@email.sk\nOr set ADMIN_EMAIL / TEST_EMAIL in .env",
    );
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Onko Klub — test e-mailu",
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#FFF3F9;border-radius:16px;">
      <div style="background:linear-gradient(180deg,#CA6A8A,#6F2380);color:white;padding:20px;border-radius:12px;text-align:center;">
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.9">ONKO KLUB</div>
        <div style="font-size:20px;font-weight:800;margin-top:4px">E-mail funguje</div>
      </div>
      <p style="color:#4A1A56;line-height:1.6;margin-top:20px">Resend je správne nakonfigurovaný. Transakčné e-maily (registrácia, prihlásenie, podujatia) budú odchádzať automaticky.</p>
      <p style="color:#6F2380;font-size:13px"><a href="${appUrl}" style="color:#6F2380">Otvoriť aplikáciu</a></p>
    </div>`,
  });

  if (error) {
    console.error("Send failed:", error.message);
    process.exit(1);
  }

  console.log(`Test email sent to ${to} (id: ${data?.id ?? "ok"})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
