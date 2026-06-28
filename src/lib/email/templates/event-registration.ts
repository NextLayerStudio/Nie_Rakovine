import { getAppUrlFromEnv } from "@/lib/email/brand";
import {
  emailDetailRows,
  emailTicketCard,
  firstName,
  formatSkDate,
  formatSkTime,
  renderEmailShell,
} from "@/lib/email/templates/shared";

export function renderEventRegistrationEmail(input: {
  fullName: string;
  eventTitle: string;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  eventId: string;
}): string {
  const name = firstName(input.fullName);
  const appUrl = getAppUrlFromEnv();
  const eventUrl = `${appUrl}/home/events/${input.eventId}`;

  const dateLabel = formatSkDate(input.startsAt);
  const timeLabel = input.endsAt
    ? `${formatSkTime(input.startsAt)} – ${formatSkTime(input.endsAt)}`
    : formatSkTime(input.startsAt);

  const details = [
    { icon: "◷", label: "Dátum", value: dateLabel },
    { icon: "◔", label: "Čas", value: timeLabel },
  ];
  if (input.location) {
    details.push({ icon: "◎", label: "Miesto", value: input.location });
  }

  const bodyHtml = `
    <p style="margin:0 0 18px;">Ahoj ${name},</p>
    <p style="margin:0 0 20px;">úspešne ste sa zaregistrovali. Tešíme sa na vás!</p>
    ${emailTicketCard(input.eventTitle, "Registrácia potvrdená")}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      ${emailDetailRows(details)}
    </table>
    <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:#6F2380B3;text-align:center;">
      V aplikácii nájdete podujatie v kalendári aj vo vašom profile.
    </p>`;

  return renderEmailShell({
    previewText: `Ste prihlásení na ${input.eventTitle}`,
    pageTitle: `Registrácia — ${input.eventTitle}`,
    heroIcon: "✓",
    heroTitle: "Ste prihlásení!",
    heroSubtitle: "Vaša registrácia na podujatie bola úspešne prijatá.",
    bodyHtml,
    cta: { label: "Zobraziť podujatie", href: eventUrl, variant: "pink" },
    secondaryLink: { label: "Otvoriť kalendár →", href: `${appUrl}/home/calendar` },
  });
}

export function renderEventRegistrationEmailSubject(eventTitle: string): string {
  return `Ste prihlásení: ${eventTitle}`;
}
