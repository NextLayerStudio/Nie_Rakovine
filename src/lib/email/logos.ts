import { getAppUrlFromEnv } from "@/lib/email/brand";

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
}: {
  src: string;
  alt: string;
  width: number;
}): string {
  return `<img src="${escapeAttr(src)}" width="${width}" alt="${escapeAttr(alt)}" border="0" style="display:block;border:0;outline:none;text-decoration:none;max-width:100%;height:auto;" />`;
}

/**
 * ONKO KLUB + NIE RAKOVINE side by side with a thin divider, matching the
 * navbar lockup on the website. No background chip — sits directly on the
 * page background.
 */
export function renderEmailLogos(
  appUrl: string,
  size: "header" | "footer" = "header",
): string {
  const onko = emailAssetUrl(EMAIL_LOGO_PATHS.onkoKlubHorizontal, appUrl);
  const nie = emailAssetUrl(EMAIL_LOGO_PATHS.nieRakovineFull, appUrl);
  const logoWidth = size === "header" ? 108 : 88;
  const dividerHeight = size === "header" ? 34 : 28;

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 ${size === "header" ? 22 : 0}px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0">
          <tr>
            <td style="vertical-align:middle;padding-right:14px;">
              ${emailLogoImg({ src: onko, alt: "ONKO KLUB", width: logoWidth })}
            </td>
            <td style="vertical-align:middle;padding:0;">
              <div style="width:1px;height:${dividerHeight}px;line-height:${dividerHeight}px;font-size:0;background:rgba(111,35,128,0.15);">&nbsp;</div>
            </td>
            <td style="vertical-align:middle;padding-left:14px;">
              ${emailLogoImg({ src: nie, alt: "NIE RAKOVINE, o. z.", width: logoWidth })}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}
