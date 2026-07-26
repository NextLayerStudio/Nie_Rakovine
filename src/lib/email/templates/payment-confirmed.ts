import { getAppUrlFromEnv } from "@/lib/email/brand";
import {
  emailDetailRows,
  escapeHtml,
  firstName,
  renderEmailShell,
} from "@/lib/email/templates/shared";

export function renderPaymentConfirmedEmail(input: {
  fullName: string;
  planLabel: string;
  amountEuro: number;
}): string {
  const name = firstName(input.fullName);
  const appUrl = getAppUrlFromEnv();

  const bodyHtml = `
    <p style="margin:0 0 18px;">Ahoj ${escapeHtml(name)},</p>
    <p style="margin:0 0 20px;">s radosťou potvrdzujeme, že sme prijali vašu platbu bankovým prevodom. Vaše členstvo v ONKO KLUBE je odteraz aktívne.</p>
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
    footerNote: "Ďakujeme, že ste členom komunity ONKO KLUB.",
  });
}
