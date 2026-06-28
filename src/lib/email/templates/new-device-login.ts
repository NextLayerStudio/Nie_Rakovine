import { getAppUrlFromEnv } from "@/lib/email/brand";
import {
  emailDetailRows,
  firstName,
  formatSkDateTime,
  renderEmailShell,
} from "@/lib/email/templates/shared";

export function renderNewDeviceLoginEmail(input: {
  fullName: string;
  deviceLabel: string;
  loginAt: Date;
}): string {
  const name = firstName(input.fullName);
  const resetUrl = `${getAppUrlFromEnv()}/reset-password`;

  const bodyHtml = `
    <p style="margin:0 0 18px;">Ahoj ${name},</p>
    <p style="margin:0 0 20px;">zaznamenali sme nové prihlásenie do vášho účtu Onko Klub:</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
      ${emailDetailRows([
        { icon: "◈", label: "Zariadenie", value: input.deviceLabel },
        { icon: "◷", label: "Čas prihlásenia", value: formatSkDateTime(input.loginAt) },
      ])}
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 8px;">
      <tr>
        <td style="padding:14px 16px;background:#FEF2F2;border-radius:14px;border:1px solid rgba(220,38,38,0.15);">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#991B1B;font-weight:600;">
            Ak ste to neboli vy, okamžite si zmeňte heslo a kontaktujte nás.
          </p>
        </td>
      </tr>
    </table>`;

  return renderEmailShell({
    previewText: "Nové prihlásenie do vášho účtu Onko Klub",
    pageTitle: "Nové prihlásenie",
    heroIcon: "◈",
    heroTitle: "Nové zariadenie",
    heroSubtitle: "Prihlásenie z neznámeho zariadenia bolo zaznamenané.",
    bodyHtml,
    cta: { label: "Zmeniť heslo", href: resetUrl, variant: "purple" },
    footerNote: "Tento e-mail slúži na ochranu vášho účtu.",
  });
}
