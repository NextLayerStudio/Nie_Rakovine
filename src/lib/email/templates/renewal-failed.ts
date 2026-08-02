import { getAppUrlFromEnv } from "@/lib/email/brand";
import { escapeHtml, firstName, renderEmailShell } from "@/lib/email/templates/shared";

export function renderRenewalFailedEmail(input: {
  fullName: string;
  planLabel: string;
}): string {
  const name = firstName(input.fullName);
  const appUrl = getAppUrlFromEnv();

  const bodyHtml = `
    <p style="margin:0 0 18px;">Ahoj ${escapeHtml(name)},</p>
    <p style="margin:0 0 20px;">nepodarilo sa nám stiahnuť platbu za obnovenie vášho členstva (${escapeHtml(input.planLabel)}). Mohlo to byť spôsobené napríklad expirovanou kartou alebo nedostatkom prostriedkov.</p>
    <p style="margin:0 0 20px;">Váš účet sme prepli na Free členstvo — zostávate naďalej oficiálnym členom NIE RAKOVINE, o. z., no bez prístupu k ONKO knižnici a bezplatnému prihlasovaniu na podujatia. Členstvo si môžete kedykoľvek znova aktivovať.</p>`;

  return renderEmailShell({
    previewText: "Nepodarilo sa nám obnoviť vaše členstvo",
    pageTitle: "Obnovenie členstva sa nepodarilo",
    heroTitle: "Obnovenie sa nepodarilo",
    heroSubtitle: "Váš účet je teraz na Free členstve.",
    bodyHtml,
    cta: { label: "Obnoviť členstvo", href: `${appUrl}/menu`, variant: "pink" },
    footerNote: "Ak si myslíte, že ide o chybu, napíšte nám na office@onkoklub.sk.",
  });
}
