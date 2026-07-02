import { BRAND, getAppUrlFromEnv } from "@/lib/email/brand";

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** PNG paths only — WebP transparency breaks in many e-mail clients (shows as black). */
export const EMAIL_LOGO_PATHS = {
  nieRakovineFull: "/logo/nie-rakovine.png",
  onkoKlubVertical: "/logo/onkoklub-vertical.png",
  onkoKlubHorizontal: "/logo/onkoklub-horizontal2.png",
} as const;

export function emailAssetUrl(
  path: string,
  appUrl: string = getAppUrlFromEnv(),
): string {
  return `${appUrl.replace(/\/$/, "")}${path}`;
}

export function emailLogoImg({
  src,
  alt,
  width,
  extraStyle = "",
}: {
  src: string;
  alt: string;
  width: number;
  extraStyle?: string;
}): string {
  return `<img src="${escapeAttr(src)}" width="${width}" alt="${escapeAttr(alt)}" border="0" style="display:block;margin:0 auto;border:0;outline:none;text-decoration:none;max-width:100%;height:auto;${extraStyle}" />`;
}

/**
 * Logos on a white card inside the purple hero — avoids black “matte” from
 * broken WebP / alpha in Gmail, Outlook, Apple Mail, etc.
 */
export function renderEmailHeroLogos(appUrl: string): string {
  const nieFull = emailAssetUrl(EMAIL_LOGO_PATHS.nieRakovineFull, appUrl);
  const onkoVertical = emailAssetUrl(EMAIL_LOGO_PATHS.onkoKlubVertical, appUrl);

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;">
    <tr>
      <td align="center" style="padding:0 8px;">
        <table role="presentation" cellspacing="0" cellpadding="0" style="background:${BRAND.white};border-radius:22px;box-shadow:0 10px 28px rgba(74,26,86,0.18);">
          <tr>
            <td align="center" style="padding:22px 28px 18px;background-color:${BRAND.white};border-radius:22px 22px 0 0;">
              ${emailLogoImg({
                src: nieFull,
                alt: "NIE RAKOVINE, o. z.",
                width: 118,
              })}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 28px 22px;background-color:${BRAND.white};border-radius:0 0 22px 22px;">
              <div style="height:1px;background:rgba(111,35,128,0.1);margin:0 0 18px;"></div>
              ${emailLogoImg({
                src: onkoVertical,
                alt: "ONKO KLUB",
                width: 88,
              })}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

/** Footer lockup on an explicit white pill (same alpha workaround). */
export function renderEmailFooterLogo(appUrl: string): string {
  const nieFull = emailAssetUrl(EMAIL_LOGO_PATHS.nieRakovineFull, appUrl);
  const onkoHorizontal = emailAssetUrl(
    EMAIL_LOGO_PATHS.onkoKlubHorizontal,
    appUrl,
  );

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 auto 14px;max-width:280px;">
    <tr>
      <td align="center" style="padding:16px 20px;background-color:${BRAND.white};border-radius:16px;border:1px solid rgba(111,35,128,0.08);">
        ${emailLogoImg({
          src: nieFull,
          alt: "NIE RAKOVINE, o. z.",
          width: 100,
          extraStyle: "margin:0 auto 12px;",
        })}
        ${emailLogoImg({
          src: onkoHorizontal,
          alt: "ONKO KLUB",
          width: 110,
        })}
      </td>
    </tr>
  </table>`;
}
