import { escapeHtml, firstName, renderEmailShell } from "@/lib/email/templates/shared";

export function renderAccountDeletedEmail(input: {
  fullName: string;
}): string {
  const name = firstName(input.fullName);

  const bodyHtml = `
    <p style="margin:0 0 18px;">Ahoj ${escapeHtml(name)},</p>
    <p style="margin:0 0 20px;">potvrdzujeme, že váš účet v Onko Klube bol natrvalo zrušený. Všetky vaše osobné údaje a nastavenia boli odstránené z našej aplikácie.</p>
    <p class="ok-muted" style="margin:0;font-size:13px;line-height:1.6;color:#6F2380B3;">Ak ste o zrušenie účtu nežiadali vy, kontaktujte nás čo najskôr. Ak sa k nám v budúcnosti chcete vrátiť, môžete si kedykoľvek vytvoriť nový účet.</p>`;

  return renderEmailShell({
    previewText: "Váš účet v Onko Klube bol zrušený",
    pageTitle: "Účet zrušený",
    heroTitle: "Účet bol zrušený",
    heroSubtitle: "Potvrdenie trvalého odstránenia vášho účtu.",
    bodyHtml,
    footerNote: "Tento e-mail je potvrdením zrušenia účtu.",
  });
}
