import { BRAND } from "@/lib/email/brand";
import { getAppUrl } from "@/lib/email/config";

type EmailLayoutOptions = {
  previewText: string;
  title: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  footerNote?: string;
};

export function renderEmailLayout({
  previewText,
  title,
  bodyHtml,
  cta,
  footerNote,
}: EmailLayoutOptions): string {
  const appUrl = getAppUrl();
  const ctaBlock = cta
    ? `<tr>
        <td style="padding:8px 0 24px;text-align:center;">
          <a href="${escapeAttr(cta.href)}" style="display:inline-block;background:${BRAND.purple};color:${BRAND.white};font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:999px;box-shadow:0 4px 14px rgba(111,35,128,0.25);">
            ${escapeHtml(cta.label)}
          </a>
        </td>
      </tr>`
    : "";

  const footer = footerNote
    ? `<p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:${BRAND.textMuted};">${escapeHtml(footerNote)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.background};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:${BRAND.white};border-radius:24px;overflow:hidden;box-shadow:0 8px 28px rgba(111,35,128,0.12);">
          <tr>
            <td style="background:linear-gradient(180deg, ${BRAND.pink} 0%, ${BRAND.pinkDark} 55%, ${BRAND.purple} 100%);padding:28px 24px;text-align:center;">
              <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.85);">ONKO KLUB</div>
              <div style="margin-top:6px;font-size:22px;font-weight:800;color:${BRAND.white};line-height:1.25;">${escapeHtml(title)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;color:${BRAND.text};font-size:15px;line-height:1.65;">
              ${bodyHtml}
            </td>
          </tr>
          ${ctaBlock}
          <tr>
            <td style="padding:0 28px 28px;border-top:1px solid rgba(111,35,128,0.08);">
              <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:${BRAND.textMuted};text-align:center;">
                NIE RAKOVINE, o. z. · Komunita Onko Klub<br />
                <a href="${escapeAttr(appUrl)}" style="color:${BRAND.purple};text-decoration:none;font-weight:600;">${escapeHtml(appUrl.replace(/^https?:\/\//, ""))}</a>
              </p>
              ${footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailParagraph(text: string): string {
  return `<p style="margin:0 0 16px;">${escapeHtml(text)}</p>`;
}

export function emailHighlightBox(lines: string[]): string {
  const rows = lines
    .map(
      (line) =>
        `<tr><td style="padding:6px 0;font-size:14px;line-height:1.5;color:${BRAND.text};">${escapeHtml(line)}</td></tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 20px;background:${BRAND.background};border-radius:16px;padding:16px 18px;">
    ${rows}
  </table>`;
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
