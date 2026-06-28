import { getAppUrlFromEnv } from "@/lib/email/brand";
import { formatEventPrice } from "@/lib/event-payment";
import {
  emailAmountBadge,
  emailDetailRows,
  emailTicketCard,
  firstName,
  formatSkDate,
  formatSkTime,
  renderEmailShell,
} from "@/lib/email/templates/shared";

export function renderEventPaymentEmail(input: {
  fullName: string;
  eventTitle: string;
  amountCents: number;
  currency: string;
  startsAt: Date;
  location: string | null;
  eventId: string;
}): string {
  const name = firstName(input.fullName);
  const appUrl = getAppUrlFromEnv();
  const eventUrl = `${appUrl}/home/events/${input.eventId}`;
  const price = formatEventPrice(input.amountCents, input.currency);

  const details = [
    { icon: "◷", label: "Dátum", value: formatSkDate(input.startsAt) },
    { icon: "◔", label: "Čas", value: formatSkTime(input.startsAt) },
  ];
  if (input.location) {
    details.push({ icon: "◎", label: "Miesto", value: input.location });
  }

  const bodyHtml = `
    <p style="margin:0 0 18px;">Ahoj ${name},</p>
    <p style="margin:0 0 20px;">ďakujeme — platba prebehla úspešne a vaša registrácia je dokončená.</p>
    ${emailAmountBadge(price)}
    ${emailTicketCard(input.eventTitle, "Platba potvrdená")}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      ${emailDetailRows(details)}
    </table>
    <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:#6F2380B3;text-align:center;">
      Toto potvrdenie si môžete kedykoľvek pozrieť v aplikácii.
    </p>`;

  return renderEmailShell({
    previewText: `Platba ${price} za ${input.eventTitle} prijatá`,
    pageTitle: `Platba — ${input.eventTitle}`,
    heroIcon: "✦",
    heroTitle: "Platba prijatá",
    heroSubtitle: "Registrácia na podujatie je kompletná.",
    bodyHtml,
    cta: { label: "Zobraziť podujatie", href: eventUrl, variant: "pink" },
  });
}

export function renderEventPaymentEmailSubject(eventTitle: string): string {
  return `Platba potvrdená: ${eventTitle}`;
}
