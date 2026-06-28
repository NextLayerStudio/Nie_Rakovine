import { BRAND, getAppUrlFromEnv } from "@/lib/email/brand";

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
    title: "Fóra a komunita",
    text: "Pripojte sa k rozhovorom s ľuďmi, ktorí rozumejú.",
  },
  {
    emoji: "❋",
    title: "Zľavy pre členov",
    text: "Využite výhody od partnerských značiek.",
  },
] as const;

function featureCards(): string {
  return FEATURES.map(
    (f) => `<tr>
      <td style="padding:0 0 10px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.background};border-radius:16px;border:1px solid rgba(111,35,128,0.08);">
          <tr>
            <td style="width:52px;padding:16px 0 16px 16px;vertical-align:top;text-align:center;">
              <div style="width:36px;height:36px;line-height:36px;border-radius:12px;background:linear-gradient(135deg,${BRAND.pink} 0%,${BRAND.purple} 100%);color:${BRAND.white};font-size:15px;font-weight:700;text-align:center;">
                ${f.emoji}
              </div>
            </td>
            <td style="padding:14px 16px 14px 4px;vertical-align:top;">
              <div style="font-size:14px;font-weight:700;color:${BRAND.purple};margin:0 0 4px;line-height:1.3;">${escapeHtml(f.title)}</div>
              <div style="font-size:13px;line-height:1.55;color:${BRAND.textMuted};margin:0;">${escapeHtml(f.text)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
  ).join("");
}

export function renderWelcomeEmail(fullName: string): string {
  const name = firstName(fullName);
  const appUrl = getAppUrlFromEnv();
  const setupUrl = `${appUrl}/register/subscription`;
  const homeUrl = `${appUrl}/home`;
  const previewText = `${name}, vitajte v Onko Klube — váš účet je pripravený.`;

  return `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Vitajte v Onko Klube</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(previewText)}&#847;&zwnj;&nbsp;</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.background};padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Outer card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:${BRAND.white};border-radius:28px;overflow:hidden;box-shadow:0 12px 40px rgba(111,35,128,0.14);">

          <!-- Hero -->
          <tr>
            <td style="background:linear-gradient(180deg, ${BRAND.pink} 0%, ${BRAND.pinkDark} 52%, ${BRAND.purple} 100%);padding:0;text-align:center;position:relative;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:36px 32px 32px;">
                    <div style="font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.78);margin-bottom:20px;">NIE RAKOVINE · ONKO KLUB</div>

                    <div style="display:inline-block;width:64px;height:64px;line-height:64px;border-radius:20px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.28);font-size:28px;margin-bottom:18px;">♡</div>

                    <div style="font-size:28px;font-weight:800;color:${BRAND.white};line-height:1.2;letter-spacing:-0.02em;margin:0 0 8px;">
                      Ahoj, ${escapeHtml(name)}!
                    </div>
                    <div style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.92);line-height:1.5;max-width:340px;margin:0 auto;">
                      Vitajte v komunite, kde nájdete podporu a porozumenie.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tagline strip -->
          <tr>
            <td style="background:${BRAND.background};padding:18px 28px;text-align:center;border-bottom:1px solid rgba(111,35,128,0.06);">
              <p style="margin:0;font-size:13px;line-height:1.65;color:${BRAND.purple};font-weight:600;">
                Miesto podpory a porozumenia na ceste s onkologickým ochorením.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 28px 8px;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:${BRAND.text};">
                Ďakujeme za registráciu. Váš účet je aktívny a pripravený — nižšie nájdete, čo vás v aplikácii čaká.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 8px;">
                ${featureCards()}
              </table>
            </td>
          </tr>

          <!-- CTAs -->
          <tr>
            <td style="padding:8px 28px 32px;text-align:center;">
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
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.textMuted};">
                NIE RAKOVINE, o. z.
              </p>
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
