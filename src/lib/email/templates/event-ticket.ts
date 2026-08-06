import { getAppUrlFromEnv } from "@/lib/email/brand";
import {
  emailDetailRows,
  emailTicketCard,
  formatSkDate,
  formatSkTime,
  renderEmailShell,
} from "@/lib/email/templates/shared";

export function renderEventTicketEmail(input: {
  firstName: string;
  ticketId: string;
  eventTitle: string;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  description: string | null;
}): string {
  const appUrl = getAppUrlFromEnv();
  const ticketUrl = `${appUrl}/podujatia/listok/${input.ticketId}`;
  const qrUrl = `${appUrl}/api/tickets/${input.ticketId}/qr`;
  const cancelUrl = `${appUrl}/podujatia/listok/${input.ticketId}/odhlasit`;

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
    <p style="margin:0 0 18px;">Dobrý deň,</p>
    <p style="margin:0 0 20px;">Vaša účasť na podujatí je potvrdená. Pri príchode sa, prosím, preukážte QR kódom, ktorý nájdete nižšie.</p>
    <p style="margin:0 0 12px;font-weight:700;">Tešíme sa na Vás!</p>
    ${emailTicketCard(input.eventTitle, `Lístok č. ${input.ticketId}`)}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      ${emailDetailRows(details)}
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0 0;">
      <tr>
        <td style="text-align:center;padding:20px;background:#FFF3F9;border-radius:16px;">
          <img src="${qrUrl}" alt="QR kód lístka" width="160" height="160" style="display:block;margin:0 auto 10px;border-radius:8px;" />
          <div class="ok-muted" style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#6F2380B3;">Ukážte tento kód na podujatí</div>
        </td>
      </tr>
    </table>
    ${input.description ? `<p class="ok-muted" style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#6F2380B3;">${input.description}</p>` : ""}`;

  return renderEmailShell({
    previewText: `Váš lístok na ${input.eventTitle}`,
    pageTitle: `Lístok — ${input.eventTitle}`,
    heroTitle: "Váš lístok je pripravený!",
    heroSubtitle: "Na mieste sa preukážete QR kódom.",
    bodyHtml,
    cta: { label: "Zobraziť lístok", href: ticketUrl, variant: "pink" },
    secondaryLink: { label: "Nemôžem sa zúčastniť — odhlásiť sa", href: cancelUrl },
  });
}

export function renderEventTicketEmailSubject(eventTitle: string): string {
  return `Váš lístok: ${eventTitle}`;
}
