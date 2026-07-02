import { escapeHtml, firstName, renderEmailShell } from "@/lib/email/templates/shared";

export function renderVerificationCodeEmail(input: {
  fullName: string;
  code: string;
  ttlMinutes: number;
}): string {
  const name = firstName(input.fullName);
  const spaced = input.code.split("").join(" ");

  const bodyHtml = `
    <p style="margin:0 0 18px;">Ahoj ${escapeHtml(name)},</p>
    <p style="margin:0 0 20px;">ďakujeme za registráciu v Onko Klube. Pre dokončenie registrácie zadajte v aplikácii tento overovací kód:</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:22px 24px;text-align:center;background:#FFF3F9;border-radius:18px;border:1px solid rgba(111,35,128,0.12);">
          <div style="font-size:34px;font-weight:800;letter-spacing:0.35em;color:#6F2380;padding-left:0.35em;">${escapeHtml(spaced)}</div>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#6F2380B3;">Kód je platný ${input.ttlMinutes} minút. Ak ste o registráciu nežiadali, tento e-mail pokojne ignorujte.</p>`;

  return renderEmailShell({
    previewText: `Váš overovací kód: ${input.code}`,
    pageTitle: "Overovací kód",
    heroIcon: "✉",
    heroTitle: "Overte svoj e-mail",
    heroSubtitle: "Zadajte kód v aplikácii a dokončite registráciu.",
    bodyHtml,
    footerNote: "Tento e-mail slúži na overenie vašej e-mailovej adresy.",
  });
}
