import type { EventPaymentStatus } from "@prisma/client";

export function formatEventPrice(
  priceCents: number,
  currency = "EUR",
  locale = "sk-SK",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceCents / 100);
}

/** Parse admin price input (e.g. "12,50" or "12.50") to cents. */
export function parsePriceToCents(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized) return null;
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100);
}

export function isEventRegistrationComplete(
  registration: { paymentStatus: EventPaymentStatus } | null | undefined,
  eventIsPaid: boolean,
): boolean {
  if (!registration) return false;
  if (!eventIsPaid) return true;
  return registration.paymentStatus === "PAID";
}

export function isEventRegistrationPendingPayment(
  registration: { paymentStatus: EventPaymentStatus } | null | undefined,
  eventIsPaid: boolean,
): boolean {
  if (!registration || !eventIsPaid) return false;
  return registration.paymentStatus === "PENDING";
}
