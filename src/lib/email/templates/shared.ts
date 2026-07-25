import { BRAND, BRAND_DARK, getAppUrlFromEnv } from "@/lib/email/brand";
import { renderEmailLogos } from "@/lib/email/logos";
import { EVENT_TIME_ZONE } from "@/lib/timezone";

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

export function formatSkDateTime(date: Date): string {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatSkTime(date: Date): string {
  return new Intl.DateTimeFormat("sk-SK", {
    timeZone: EVENT_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatSkDate(date: Date): string {
  return new Intl.DateTimeFormat("sk-SK", {
    timeZone: EVENT_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Dark-mode overrides for the .ok-* classes used throughout these templates. */
export function emailDarkModeStyleTag(): string {
  return `<style>
    @media (prefers-color-scheme: dark) {
      .ok-bg { background:${BRAND_DARK.background} !important; }
      .ok-text { color:${BRAND_DARK.text} !important; }
      .ok-muted { color:${BRAND_DARK.textMuted} !important; }
      .ok-surface { background:${BRAND_DARK.surface} !important; border-color:rgba(255,255,255,0.08) !important; }
      .ok-border { border-color:rgba(255,255,255,0.08) !important; }
      .ok-chip { background:rgba(255,255,255,0.08) !important; color:${BRAND_DARK.text} !important; }
    }
  </style>`;
}

export function emailColorSchemeMeta(): string {
  return `<meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />`;
}

type DetailRow = {
  icon: string;
  label: string;
  value: string;
};

export function emailDetailRows(rows: DetailRow[]): string {
  return rows
    .map(
      (row) => `<tr>
        <td style="padding:0 0 10px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="ok-surface" style="background:${BRAND.background};border-radius:14px;border:1px solid rgba(111,35,128,0.08);">
            <tr>
              <td style="width:48px;padding:14px 0 14px 14px;vertical-align:top;text-align:center;">
                <div class="ok-chip" style="width:32px;height:32px;line-height:32px;border-radius:10px;background:rgba(111,35,128,0.1);color:${BRAND.purple};font-size:14px;font-weight:700;">${row.icon}</div>
              </td>
              <td style="padding:12px 14px 12px 2px;vertical-align:top;">
                <div class="ok-muted" style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.textMuted};margin:0 0 3px;">${escapeHtml(row.label)}</div>
                <div class="ok-text" style="font-size:14px;font-weight:600;line-height:1.45;color:${BRAND.text};margin:0;">${escapeHtml(row.value)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
    )
    .join("");
}

export function emailTicketCard(title: string, subtitle?: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
    <tr>
      <td align="center" class="ok-surface" style="padding:20px 22px;text-align:center;background:${BRAND.background};border-radius:16px;border:1px solid rgba(111,35,128,0.1);">
        <div class="ok-muted" style="font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.textMuted};margin-bottom:8px;">PODUJATIE</div>
        <div class="ok-text" style="font-size:19px;font-weight:800;color:${BRAND.text};line-height:1.25;letter-spacing:-0.01em;">${escapeHtml(title)}</div>
        ${subtitle ? `<div class="ok-muted" style="margin-top:6px;font-size:13px;font-weight:600;color:${BRAND.textMuted};">${escapeHtml(subtitle)}</div>` : ""}
      </td>
    </tr>
  </table>`;
}

export function emailAmountBadge(amount: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
    <tr>
      <td style="padding:18px 20px;text-align:center;background:#FEF3C7;border-radius:16px;border:1px solid rgba(245,158,11,0.25);">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#92400E;margin-bottom:6px;">Uhradená suma</div>
        <div style="font-size:28px;font-weight:800;color:#78350F;letter-spacing:-0.02em;">${escapeHtml(amount)}</div>
      </td>
    </tr>
  </table>`;
}

type EmailShellOptions = {
  previewText: string;
  pageTitle: string;
  /** @deprecated Logos are shown in the header instead of emoji icons. */
  heroIcon?: string;
  heroTitle: string;
  heroSubtitle?: string;
  bodyHtml: string;
  cta?: { label: string; href: string; variant?: "pink" | "purple" };
  secondaryLink?: { label: string; href: string };
  footerNote?: string;
};

export function renderEmailShell({
  previewText,
  pageTitle,
  heroTitle,
  heroSubtitle,
  bodyHtml,
  cta,
  secondaryLink,
  footerNote,
}: EmailShellOptions): string {
  const appUrl = getAppUrlFromEnv();
  const ctaBg = cta?.variant === "purple" ? BRAND.purple : BRAND.pink;

  const ctaBlock = cta
    ? `<tr>
        <td style="padding:8px 28px 8px;text-align:center;">
          <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto ${secondaryLink ? "14px" : "0"};">
            <tr>
              <td style="border-radius:999px;background:${ctaBg};">
                <a href="${escapeAttr(cta.href)}" style="display:inline-block;padding:15px 34px;font-size:15px;font-weight:800;color:${BRAND.white};text-decoration:none;">
                  ${escapeHtml(cta.label)}
                </a>
              </td>
            </tr>
          </table>
          ${
            secondaryLink
              ? `<a href="${escapeAttr(secondaryLink.href)}" class="ok-muted" style="font-size:13px;font-weight:700;color:${BRAND.purple};text-decoration:none;border-bottom:1px solid rgba(111,35,128,0.25);padding-bottom:1px;">${escapeHtml(secondaryLink.label)}</a>`
              : ""
          }
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${emailColorSchemeMeta()}
  <title>${escapeHtml(pageTitle)}</title>
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
              <div class="ok-text" style="font-size:22px;font-weight:800;color:${BRAND.text};line-height:1.3;letter-spacing:-0.01em;margin:0 0 6px;">${escapeHtml(heroTitle)}</div>
              ${heroSubtitle ? `<div class="ok-muted" style="font-size:14px;font-weight:500;color:${BRAND.textMuted};line-height:1.5;max-width:360px;margin:0 auto;">${escapeHtml(heroSubtitle)}</div>` : ""}
            </td>
          </tr>
          <tr>
            <td class="ok-text" style="padding:0 28px 8px;font-size:15px;line-height:1.7;color:${BRAND.text};">
              ${bodyHtml}
            </td>
          </tr>
          ${ctaBlock}
          <tr>
            <td class="ok-border" style="padding:24px 28px 8px;border-top:1px solid rgba(111,35,128,0.1);text-align:center;">
              ${renderEmailLogos(appUrl, "footer")}
              ${footerNote ? `<p class="ok-muted" style="margin:16px 0 14px;font-size:12px;line-height:1.6;color:${BRAND.textMuted};">${escapeHtml(footerNote)}</p>` : `<div style="height:16px;"></div>`}
              <a href="${escapeAttr(appUrl)}" class="ok-muted" style="font-size:12px;font-weight:600;color:${BRAND.purple};text-decoration:none;">${escapeHtml(appUrl.replace(/^https?:\/\//, ""))}</a>
            </td>
          </tr>
        </table>
        <p class="ok-muted" style="margin:20px 0 0;font-size:11px;color:rgba(74,26,86,0.45);text-align:center;">© ONKO KLUB · Komunita NIE RAKOVINE</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
