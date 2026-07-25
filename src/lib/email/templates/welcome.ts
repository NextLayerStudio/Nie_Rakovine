import { BRAND, getAppUrlFromEnv } from "@/lib/email/brand";
import { renderEmailLogos } from "@/lib/email/logos";
import { emailColorSchemeMeta, emailDarkModeStyleTag } from "@/lib/email/templates/shared";

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
    title: "Diskusné fóra",
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
      <span class="ok-text" style="font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.purple};">${escapeHtml(label)}</span>
    </td>`;
  const dot = `<td style="padding:6px 0;text-align:center;vertical-align:middle;font-size:10px;font-weight:700;color:${BRAND.pink};width:12px;">•</td>`;

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="ok-surface" style="margin:0 0 24px;background:${BRAND.background};border-radius:16px;border:1px solid rgba(111,35,128,0.1);">
    <tr>
      <td style="padding:16px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" align="center">
          <tr>
            ${cell("PODPORA")}${dot}${cell("ZDIEĽANIE")}${dot}${cell("POROZUMENIE")}${dot}${cell("PRAKTICKÉ INFO")}
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
        ? `<div class="ok-text" style="font-size:14px;font-weight:800;color:${BRAND.purple};margin:0 0 2px;line-height:1.35;letter-spacing:0.02em;">${escapeHtml(f.title)}</div>
              <div class="ok-muted" style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.pink};margin:0 0 6px;">${escapeHtml(f.subtitle)}</div>`
        : `<div class="ok-text" style="font-size:14px;font-weight:700;color:${BRAND.purple};margin:0 0 4px;line-height:1.3;">${escapeHtml(f.title)}</div>`;

    return `<tr>
      <td style="padding:0 0 10px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="ok-surface" style="background:${BRAND.background};border-radius:16px;border:1px solid rgba(111,35,128,0.08);">
          <tr>
            <td style="width:52px;padding:16px 0 16px 16px;vertical-align:top;text-align:center;">
              <div class="ok-chip" style="width:36px;height:36px;line-height:36px;border-radius:12px;background:rgba(111,35,128,0.1);color:${BRAND.purple};font-size:15px;font-weight:700;text-align:center;">
                ${f.emoji}
              </div>
            </td>
            <td style="padding:14px 16px 14px 4px;vertical-align:top;">
              ${titleHtml}
              <div class="ok-muted" style="font-size:13px;line-height:1.55;color:${BRAND.textMuted};margin:0;">${escapeHtml(f.text)}</div>
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
  ${emailColorSchemeMeta()}
  <title>Vitajte v ONKO KLUBE</title>
  ${emailDarkModeStyleTag()}
</head>
<body class="ok-bg" style="margin:0;padding:0;background:${BRAND.white};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(previewText)}&#847;&zwnj;&nbsp;</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="ok-bg" style="background:${BRAND.white};padding:36px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;">

          <tr>
            <td style="padding:0 24px 26px;text-align:center;">
              ${renderEmailLogos(appUrl, "header")}
              <div class="ok-text" style="font-size:24px;font-weight:800;color:${BRAND.text};line-height:1.3;letter-spacing:-0.01em;margin:0 0 8px;">
                Ahoj, ${escapeHtml(name)}!
              </div>
              <div class="ok-muted" style="font-size:15px;font-weight:500;color:${BRAND.textMuted};line-height:1.6;max-width:380px;margin:0 auto;">
                Vitajte v ONKO KLUBE – bezpečnom priestore pre ľudí, ktorých život zasiahlo onkologické ochorenie.
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 8px;">
              ${membershipPillarsRow()}

              <p class="ok-text" style="margin:0 0 22px;font-size:15px;line-height:1.75;color:${BRAND.text};">
                Ďakujeme, že ste sa k nám pridali. Váš účet je aktívny a pripravený. Nižšie sa dozviete, čo všetko máte v rámci členstva k dispozícii.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 8px;">
                ${featureCards()}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 28px 8px;text-align:center;">
              <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto 14px;">
                <tr>
                  <td style="border-radius:999px;background:${BRAND.pink};">
                    <a href="${escapeAttr(setupUrl)}" style="display:inline-block;padding:15px 34px;font-size:15px;font-weight:800;color:${BRAND.white};text-decoration:none;letter-spacing:0.01em;">
                      Pokračovať v nastavení účtu
                    </a>
                  </td>
                </tr>
              </table>

              <a href="${escapeAttr(homeUrl)}" class="ok-muted" style="font-size:13px;font-weight:700;color:${BRAND.purple};text-decoration:none;border-bottom:1px solid rgba(111,35,128,0.25);padding-bottom:1px;">
                Alebo prejsť priamo do aplikácie →
              </a>
            </td>
          </tr>

          <tr>
            <td class="ok-border" style="padding:24px 28px 8px;border-top:1px solid rgba(111,35,128,0.1);text-align:center;">
              ${renderEmailLogos(appUrl, "footer")}
              <p class="ok-muted" style="margin:16px 0 14px;font-size:12px;line-height:1.6;color:${BRAND.textMuted};">
                Ak ste sa neregistrovali vy, ignorujte tento e-mail alebo nás kontaktujte.
              </p>
              <a href="${escapeAttr(appUrl)}" class="ok-muted" style="font-size:12px;font-weight:600;color:${BRAND.purple};text-decoration:none;">
                ${escapeHtml(appUrl.replace(/^https?:\/\//, ""))}
              </a>
            </td>
          </tr>

        </table>

        <p class="ok-muted" style="margin:20px 0 0;font-size:11px;color:rgba(74,26,86,0.45);text-align:center;">
          © ONKO KLUB · Komunita NIE RAKOVINE
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
