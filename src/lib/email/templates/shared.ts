import { BRAND, getAppUrlFromEnv } from "@/lib/email/brand";

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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatSkDate(date: Date): string {
  return new Intl.DateTimeFormat("sk-SK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
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
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.background};border-radius:14px;border:1px solid rgba(111,35,128,0.08);">
            <tr>
              <td style="width:48px;padding:14px 0 14px 14px;vertical-align:top;text-align:center;">
                <div style="width:32px;height:32px;line-height:32px;border-radius:10px;background:rgba(111,35,128,0.1);color:${BRAND.purple};font-size:14px;font-weight:700;">${row.icon}</div>
              </td>
              <td style="padding:12px 14px 12px 2px;vertical-align:top;">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.textMuted};margin:0 0 3px;">${escapeHtml(row.label)}</div>
                <div style="font-size:14px;font-weight:600;line-height:1.45;color:${BRAND.text};margin:0;">${escapeHtml(row.value)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
    )
    .join("");
}

export function emailTicketCard(title: string, subtitle?: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;background:linear-gradient(135deg, ${BRAND.pink} 0%, ${BRAND.purple} 100%);border-radius:20px;overflow:hidden;">
    <tr>
      <td style="padding:22px 24px;text-align:center;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.75);margin-bottom:8px;">PODUJATIE</div>
        <div style="font-size:20px;font-weight:800;color:${BRAND.white};line-height:1.25;letter-spacing:-0.01em;">${escapeHtml(title)}</div>
        ${subtitle ? `<div style="margin-top:8px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.88);">${escapeHtml(subtitle)}</div>` : ""}
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
  heroIcon: string;
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
  heroIcon,
  heroTitle,
  heroSubtitle,
  bodyHtml,
  cta,
  secondaryLink,
  footerNote,
}: EmailShellOptions): string {
  const appUrl = getAppUrlFromEnv();
  const ctaBg = cta?.variant === "purple" ? BRAND.purple : BRAND.pink;
  const ctaShadow =
    cta?.variant === "purple"
      ? "0 6px 20px rgba(111,35,128,0.32)"
      : "0 6px 20px rgba(202,106,138,0.38)";

  const ctaBlock = cta
    ? `<tr>
        <td style="padding:8px 28px 32px;text-align:center;">
          <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto ${secondaryLink ? "14px" : "0"};">
            <tr>
              <td style="border-radius:999px;background:${ctaBg};box-shadow:${ctaShadow};">
                <a href="${escapeAttr(cta.href)}" style="display:inline-block;padding:16px 36px;font-size:15px;font-weight:800;color:${BRAND.white};text-decoration:none;">
                  ${escapeHtml(cta.label)}
                </a>
              </td>
            </tr>
          </table>
          ${
            secondaryLink
              ? `<a href="${escapeAttr(secondaryLink.href)}" style="font-size:13px;font-weight:700;color:${BRAND.purple};text-decoration:none;border-bottom:1px solid rgba(111,35,128,0.25);padding-bottom:1px;">${escapeHtml(secondaryLink.label)}</a>`
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
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(pageTitle)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(previewText)}&#847;&zwnj;&nbsp;</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.background};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:${BRAND.white};border-radius:28px;overflow:hidden;box-shadow:0 12px 40px rgba(111,35,128,0.14);">
          <tr>
            <td style="background:linear-gradient(180deg, ${BRAND.pink} 0%, ${BRAND.pinkDark} 52%, ${BRAND.purple} 100%);padding:36px 32px 32px;text-align:center;">
              <div style="font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.78);margin-bottom:18px;">NIE RAKOVINE · ONKO KLUB</div>
              <div style="display:inline-block;width:60px;height:60px;line-height:60px;border-radius:18px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.28);font-size:26px;margin-bottom:16px;">${heroIcon}</div>
              <div style="font-size:24px;font-weight:800;color:${BRAND.white};line-height:1.25;letter-spacing:-0.02em;margin:0 0 8px;">${escapeHtml(heroTitle)}</div>
              ${heroSubtitle ? `<div style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.9);line-height:1.5;max-width:360px;margin:0 auto;">${escapeHtml(heroSubtitle)}</div>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;font-size:15px;line-height:1.7;color:${BRAND.text};">
              ${bodyHtml}
            </td>
          </tr>
          ${ctaBlock}
          <tr>
            <td style="padding:22px 28px 28px;border-top:1px solid rgba(111,35,128,0.08);background:${BRAND.background};text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.textMuted};">NIE RAKOVINE, o. z.</p>
              ${footerNote ? `<p style="margin:0 0 14px;font-size:12px;line-height:1.6;color:${BRAND.textMuted};">${escapeHtml(footerNote)}</p>` : ""}
              <a href="${escapeAttr(appUrl)}" style="font-size:12px;font-weight:600;color:${BRAND.purple};text-decoration:none;">${escapeHtml(appUrl.replace(/^https?:\/\//, ""))}</a>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:11px;color:rgba(111,35,128,0.45);text-align:center;">© Onko Klub · Komunita NIE RAKOVINE</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
