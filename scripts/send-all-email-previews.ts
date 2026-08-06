/**
 * Send all 8 automated Onko Klub email templates to a test inbox
 * and dump their rendered HTML to disk for archiving.
 * Usage: npx tsx scripts/send-all-email-previews.ts you@email.sk /path/to/output-dir
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { Resend } from "resend";

import { renderWelcomeEmail } from "../src/lib/email/templates/welcome";
import { renderNewDeviceLoginEmail } from "../src/lib/email/templates/new-device-login";
import {
  renderEventTicketEmail,
  renderEventTicketEmailSubject,
} from "../src/lib/email/templates/event-ticket";
import { renderPaymentConfirmedEmail } from "../src/lib/email/templates/payment-confirmed";
import { renderRenewalFailedEmail } from "../src/lib/email/templates/renewal-failed";
import { renderAccountDeletedEmail } from "../src/lib/email/templates/account-deleted";
import { renderPasswordResetEmail } from "../src/lib/email/templates/password-reset";
import { renderVerificationCodeEmail } from "../src/lib/email/templates/verification-code";

function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename);
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
      } else if (val.startsWith('"') || val.startsWith("'")) {
        val = val.slice(1);
      }
      if (/^[^<]*<[^\s<>]+@[^\s<>]+$/.test(val)) val = `${val}>`;
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // ignore missing file
  }
}

const now = new Date();
const inTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

const emails: { file: string; subject: string; html: string }[] = [
  {
    file: "01-vitajte-welcome.html",
    subject: "Vitajte v Onko Klube ♡",
    html: renderWelcomeEmail("Andrej Paulička"),
  },
  {
    file: "02-overovaci-kod-verification-code.html",
    subject: "Overovací kód do Onko Klubu",
    html: renderVerificationCodeEmail({
      fullName: "Andrej Paulička",
      code: "482913",
      ttlMinutes: 15,
    }),
  },
  {
    file: "03-zmena-hesla-password-reset.html",
    subject: "Zmena hesla do Onko Klubu",
    html: renderPasswordResetEmail({
      fullName: "Andrej Paulička",
      url: "https://onkoklub.sk/reset-password?token=ukazkovy-token",
      ttlMinutes: 60,
    }),
  },
  {
    file: "04-nove-prihlasenie-new-device-login.html",
    subject: "Nové prihlásenie do Onko Klubu",
    html: renderNewDeviceLoginEmail({
      fullName: "Andrej Paulička",
      deviceLabel: "iPhone",
      loginAt: now,
    }),
  },
  {
    file: "05-platba-prijata-payment-confirmed.html",
    subject: "Platba prijatá — členstvo ONKO KLUB je aktívne",
    html: renderPaymentConfirmedEmail({
      fullName: "Andrej Paulička",
      planLabel: "Ročné členstvo",
      amountEuro: 39,
    }),
  },
  {
    file: "06-obnovenie-zlyhalo-renewal-failed.html",
    subject: "Obnovenie členstva sa nepodarilo — účet je na Free",
    html: renderRenewalFailedEmail({
      fullName: "Andrej Paulička",
      planLabel: "Ročné členstvo",
    }),
  },
  {
    file: "07-ucet-zruseny-account-deleted.html",
    subject: "Váš účet v Onko Klube bol zrušený",
    html: renderAccountDeletedEmail(),
  },
  {
    file: "08-listok-na-podujatie-event-ticket.html",
    subject: renderEventTicketEmailSubject("Beh pre nádej 2026"),
    html: renderEventTicketEmail({
      firstName: "Andrej",
      ticketId: "demo-ticket-id",
      eventTitle: "Beh pre nádej 2026",
      startsAt: inTwoWeeks,
      endsAt: null,
      location: "Sad Janka Kráľa, Bratislava",
      description: "Charitatívny beh na podporu onkologických pacientov.",
    }),
  },
];

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const apiKey =
    process.env.RESEND_API_KEY?.trim() ||
    process.env.RESEND_API_KEY_ONKO?.trim();
  let from = process.env.EMAIL_FROM?.trim() ?? "";
  if (from.startsWith('"') || from.startsWith("'")) from = from.slice(1);
  if (/^[^<]*<[^\s<>]+@[^\s<>]+$/.test(from)) from = `${from}>`;

  const to = process.argv[2]?.trim();
  const outDir = process.argv[3]?.trim();

  if (outDir) {
    mkdirSync(outDir, { recursive: true });
    for (const email of emails) {
      writeFileSync(resolve(outDir, email.file), email.html, "utf8");
    }
    console.log(`Uložených ${emails.length} HTML náhľadov do ${outDir}`);
  }

  if (!to) {
    console.log("Žiadny príjemca zadaný — preskakujem odosielanie, iba ukladám súbory.");
    return;
  }

  if (!apiKey || !from) {
    console.error("Chýba RESEND_API_KEY alebo EMAIL_FROM — nemôžem odoslať emaily.");
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  for (const email of emails) {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `[PREVIEW] ${email.subject}`,
      html: email.html,
    });
    if (error) {
      console.error(`✗ ${email.file}: ${error.message}`);
    } else {
      console.log(`✓ ${email.file} odoslaný (id: ${data?.id ?? "ok"})`);
    }
    // small delay to be gentle with rate limits
    await new Promise((r) => setTimeout(r, 600));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
