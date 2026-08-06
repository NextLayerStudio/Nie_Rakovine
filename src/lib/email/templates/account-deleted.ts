import { renderEmailShell } from "@/lib/email/templates/shared";

export function renderAccountDeletedEmail(): string {
  const bodyHtml = `
    <p style="margin:0 0 18px;">Dobrý deň,</p>
    <p style="margin:0 0 20px;">potvrdzujeme, že váš účet v ONKO KLUBE bol natrvalo zrušený. Všetky Vaše osobné údaje a nastavenia boli z aplikácie odstránené v súlade s Vašou požiadavkou.</p>
    <p class="ok-muted" style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#6F2380B3;">Ak ste o zrušenie účtu nežiadali Vy, kontaktujte nás čo najskôr.</p>
    <p class="ok-muted" style="margin:0;font-size:13px;line-height:1.6;color:#6F2380B3;">Dvere ONKO KLUBU Vám zostávajú vždy otvorené. Ak sa k nám v budúcnosti rozhodnete vrátiť, môžete si kedykoľvek vytvoriť nový účet.</p>`;

  return renderEmailShell({
    previewText: "Váš účet v Onko Klube bol zrušený",
    pageTitle: "Účet zrušený",
    heroTitle: "Účet bol zrušený",
    heroSubtitle: "Potvrdenie trvalého odstránenia vášho účtu.",
    bodyHtml,
    footerNote: "Tento e-mail je potvrdením zrušenia účtu.",
  });
}
