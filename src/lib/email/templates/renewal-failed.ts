import { getAppUrlFromEnv } from "@/lib/email/brand";
import { escapeHtml, renderEmailShell } from "@/lib/email/templates/shared";

export function renderRenewalFailedEmail(input: {
  fullName: string;
  planLabel: string;
}): string {
  const appUrl = getAppUrlFromEnv();

  const bodyHtml = `
    <p style="margin:0 0 18px;">Dobrý deň,</p>
    <p style="margin:0 0 20px;">nepodarilo sa nám spracovať platbu za obnovenie vášho členstva (${escapeHtml(input.planLabel)}) v ONKO KLUBE. Dôvodom mohla byť napríklad expirovaná platobná karta alebo nedostatok finančných prostriedkov na účte.</p>
    <p style="margin:0 0 20px;">Vaše členstvo sme preto dočasne nastavili na Free členstvo. Naďalej zostávate oficiálnym členom NIE RAKOVINE, o. z., avšak bez prístupu k ONKO knižnici a možnosti bezplatnej účasti na vybraných podujatiach.</p>
    <p style="margin:0 0 20px;">Ak chcete opäť využívať všetky výhody Ročného členstva v ONKO KLUBE, môžete si ho kedykoľvek znovu aktivovať.</p>
    <p style="margin:0 0 20px;">Ďakujeme, že zostávate súčasťou našej komunity.</p>`;

  return renderEmailShell({
    previewText: "Nepodarilo sa nám obnoviť vaše členstvo",
    pageTitle: "Obnovenie členstva sa nepodarilo",
    heroTitle: "Obnovenie sa nepodarilo",
    heroSubtitle: "Váš účet je momentálne aktívny v rámci Free členstva.",
    bodyHtml,
    cta: { label: "Obnoviť členstvo", href: `${appUrl}/menu`, variant: "pink" },
    footerNote: "Ak si myslíte, že ide o chybu, napíšte nám na office@onkoklub.sk.",
  });
}
