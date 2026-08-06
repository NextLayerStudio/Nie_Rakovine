import { getAppUrlFromEnv } from "@/lib/email/brand";
import {
  emailDetailRows,
  renderEmailShell,
} from "@/lib/email/templates/shared";

export function renderPaymentConfirmedEmail(input: {
  fullName: string;
  planLabel: string;
  amountEuro: number;
}): string {
  const appUrl = getAppUrlFromEnv();

  const bodyHtml = `
    <p style="margin:0 0 18px;">Dobrý deň,</p>
    <p style="margin:0 0 18px;">veľmi si vážime vašu dôveru a podporu, ktorá nám umožňuje ďalej rozvíjať pomoc pre ľudí s onkologickým ochorením.</p>
    <p style="margin:0 0 18px;">S radosťou potvrdzujeme, že sme prijali Vašu platbu bankovým prevodom a Vaše členstvo v ONKO KLUBE je odteraz aktívne.</p>
    <p style="margin:0 0 20px;">Tešíme sa, že ste medzi nami! Veríme, že vám ONKO KLUB prinesie užitočné informácie, podporu a pocit, že v tom nie ste sami.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      ${emailDetailRows([
        { icon: "◈", label: "Členstvo", value: input.planLabel },
        { icon: "€", label: "Prijatá suma", value: `${input.amountEuro} €` },
      ])}
    </table>`;

  return renderEmailShell({
    previewText: "Vaša platba bola prijatá — členstvo je aktívne",
    pageTitle: "Platba prijatá",
    heroTitle: "Platba prijatá!",
    heroSubtitle: "Vaše členstvo v ONKO KLUBE je teraz aktívne.",
    bodyHtml,
    cta: { label: "Otvoriť ONKO KLUB", href: `${appUrl}/home`, variant: "pink" },
    footerNote: "Komunita je naše srdce. Ďakujeme, že ste s nami!",
  });
}
