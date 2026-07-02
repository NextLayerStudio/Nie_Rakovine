import { BRAND, getAppUrlFromEnv } from "@/lib/email/brand";
import {
  renderEmailFooterLogo,
  renderEmailHeroLogos,
} from "@/lib/email/logos";

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

const FEATURES = [
  {
    emoji: "✦",
    title: "Dokončite profil",
    text: "Prispôsobte si obsah podľa diagnózy a záujmov.",
  },
  {
    emoji: "◉",
    title: "Podujatia a aktivity",
    text: "Objavte stretnutia, workshopy a aktivity v okolí.",
  },
  {
    emoji: "◎",
    title: "DISKUSNÉ FÓRA",
    subtitle: "komunita pre vás",
    text: "Podeľte sa o svoje skúsenosti s ľuďmi, ktorí vám rozumejú.",
  },
  {
    emoji: "❋",
    title: "Zľavy pre členov",
    text: "Využite výhody od partnerských značiek.",
  },
] as const;

function membershipPillarsRow(): string {
  const cell = (label: string) =>
    `<td style="padding:6px 8px;text-align:center;vertical-align:middle;">
      <span style="font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.purple};">${escapeHtml(label)}</span>
    </td>`;
  const dot = `<td style="padding:6px 0;text-align:center;vertical-align:middle;font-size:10px;font-weight:700;color:${BRAND.pink};width:12px;">•</td>`;

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:20px 14px;background:${BRAND.background};border-radius:18px;border:1px solid rgba(111,35,128,0.1);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" align="center">
          <tr>
            ${cell("PODPORA")}${dot}${cell("ZDIEĽANIE")}${dot}${cell("POROZUMENIE")}${dot}${cell("PRAKTICKÉ INFORMÁCIE")}
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function featureCards(): string {
  return FEATURES.map((f) => {
    const titleHtml =
      "subtitle" in f && f.subtitle
        ? `<div style="font-size:14px;font-weight:800;color:${BRAND.purple};margin:0 0 2px;line-height:1.35;letter-spacing:0.02em;">${escapeHtml(f.title)}</div>
              <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.pink};margin:0 0 6px;">${escapeHtml(f.subtitle)}</div>`
        : `<div style="font-size:14px;font-weight:700;color:${BRAND.purple};margin:0 0 4px;line-height:1.3;">${escapeHtml(f.title)}</div>`;

    return `<tr>
      <td style="padding:0 0 10px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.background};border-radius:16px;border:1px solid rgba(111,35,128,0.08);">
          <tr>
            <td style="width:52px;padding:16px 0 16px 16px;vertical-align:top;text-align:center;">
              <div style="width:36px;height:36px;line-height:36px;border-radius:12px;background:linear-gradient(135deg,${BRAND.pink} 0%,${BRAND.purple} 100%);color:${BRAND.white};font-size:15px;font-weight:700;text-align:center;">
                ${f.emoji}
              </div>
            </td>
            <td style="padding:14px 16px 14px 4px;vertical-align:top;">
              ${titleHtml}
              <div style="font-size:13px;line-height:1.55;color:${BRAND.textMuted};margin:0;">${escapeHtml(f.text)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
  }).join("");
}

export function renderWelcomeEmail(fullName: string): string {
  const name = firstName(fullName);
  const appUrl = getAppUrlFromEnv();
  const setupUrl = `${appUrl}/register/subscription`;
  const homeUrl = `${appUrl}/home`;
  const previewText = `${name}, vitajte v ONKO KLUBE — váš účet je pripravený.`;

  return `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Vitajte v ONKO KLUBE</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(previewText)}&#847;&zwnj;&nbsp;</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.background};padding:40px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:${BRAND.white};border-radius:28px;overflow:hidden;box-shadow:0 12px 40px rgba(111,35,128,0.14);">

          <!-- Fialová časť -->
          <tr>
            <td style="background:linear-gradient(180deg, ${BRAND.pink} 0%, ${BRAND.pinkDark} 48%, ${BRAND.purple} 100%);padding:0;text-align:center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:36px 32px 36px;">
                    ${renderEmailHeroLogos(appUrl)}

                    <div style="font-size:26px;font-weight:800;color:${BRAND.white};line-height:1.25;letter-spacing:-0.02em;margin:0 0 16px;">
                      Ahoj, ${escapeHtml(name)}!
                    </div>
                    <div style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.94);line-height:1.65;max-width:380px;margin:0 auto;">
                      Vitajte v ONKO KLUBE – bezpečnom priestore pre ľudí, ktorých život zasiahlo onkologické ochorenie.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Biela časť -->
          <tr>
            <td style="padding:32px 28px 8px;background:${BRAND.white};">
              ${membershipPillarsRow()}

              <p style="margin:0 0 22px;font-size:15px;line-height:1.75;color:${BRAND.text};">
                Ďakujeme, že ste sa k nám pridali. Váš účet je aktívny a pripravený. Nižšie sa dozviete, čo všetko máte v rámci členstva k dispozícii.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 8px;">
                ${featureCards()}
              </table>
            </td>
          </tr>

          <!-- CTAs -->
          <tr>
            <td style="padding:8px 28px 32px;text-align:center;background:${BRAND.white};">
              <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto 14px;">
                <tr>
                  <td style="border-radius:999px;background:${BRAND.pink};box-shadow:0 6px 20px rgba(202,106,138,0.38);">
                    <a href="${escapeAttr(setupUrl)}" style="display:inline-block;padding:16px 36px;font-size:15px;font-weight:800;color:${BRAND.white};text-decoration:none;letter-spacing:0.01em;">
                      Pokračovať v nastavení účtu
                    </a>
                  </td>
                </tr>
              </table>

              <a href="${escapeAttr(homeUrl)}" style="font-size:13px;font-weight:700;color:${BRAND.purple};text-decoration:none;border-bottom:1px solid rgba(111,35,128,0.25);padding-bottom:1px;">
                Alebo prejsť priamo do aplikácie →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 28px 28px;border-top:1px solid rgba(111,35,128,0.08);background:${BRAND.background};text-align:center;">
              ${renderEmailFooterLogo(appUrl)}
              <p style="margin:0 0 14px;font-size:12px;line-height:1.6;color:${BRAND.textMuted};">
                Ak ste sa neregistrovali vy, ignorujte tento e-mail alebo nás kontaktujte.
              </p>
              <a href="${escapeAttr(appUrl)}" style="font-size:12px;font-weight:600;color:${BRAND.purple};text-decoration:none;">
                ${escapeHtml(appUrl.replace(/^https?:\/\//, ""))}
              </a>
            </td>
          </tr>

        </table>

        <p style="margin:20px 0 0;font-size:11px;color:rgba(111,35,128,0.45);text-align:center;">
          © Onko Klub · Komunita NIE RAKOVINE
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
