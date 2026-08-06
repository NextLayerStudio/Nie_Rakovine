import { renderEmailShell } from "@/lib/email/templates/shared";

export function renderPasswordResetEmail(input: {
  fullName: string;
  url: string;
  ttlMinutes: number;
}): string {
  const bodyHtml = `
    <p style="margin:0 0 18px;">Dobrý deň,</p>
    <p style="margin:0 0 20px;">Dostali sme požiadavku na zmenu hesla k Vášmu účtu v ONKO KLUBE. Kliknite na tlačidlo nižšie a nastavte si nové heslo.</p>
    <p class="ok-muted" style="margin:0;font-size:13px;line-height:1.6;color:#6F2380B3;">Odkaz je platný ${input.ttlMinutes} minút a dá sa použiť iba raz. Ak ste o zmenu hesla nežiadali, tento e-mail ignorujte — vaše heslo ostáva nezmenené.</p>`;

  return renderEmailShell({
    previewText: "Nastavte si nové heslo do Onko Klubu",
    pageTitle: "Zmena hesla",
    heroIcon: "⚿",
    heroTitle: "Zmena hesla",
    heroSubtitle: "Kliknutím na odkaz nastavíte nové heslo.",
    bodyHtml,
    cta: { label: "Nastaviť nové heslo", href: input.url, variant: "purple" },
    footerNote: "Z bezpečnostných dôvodov odkaz čoskoro vyprší.",
  });
}
