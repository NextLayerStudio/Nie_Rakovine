import "server-only";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendTransactionalEmailAsync } from "@/lib/email/client";
import {
  renderEventPaymentEmail,
  renderEventPaymentEmailSubject,
} from "@/lib/email/templates/event-payment";
import {
  renderEventRegistrationEmail,
  renderEventRegistrationEmailSubject,
} from "@/lib/email/templates/event-registration";
import { renderNewDeviceLoginEmail } from "@/lib/email/templates/new-device-login";
import { renderWelcomeEmail } from "@/lib/email/templates/welcome";

const DEVICE_COOKIE = "onko_device";
const DEVICE_MAX_AGE = 60 * 60 * 24 * 365;

function deviceLabelFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("iphone")) return "iPhone";
  if (ua.includes("ipad")) return "iPad";
  if (ua.includes("android")) return "Android";
  if (ua.includes("mac os")) return "Mac";
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("linux")) return "Linux";
  return "Neznáme zariadenie";
}

export function queueWelcomeEmail(input: {
  email: string;
  fullName: string;
}): void {
  sendTransactionalEmailAsync({
    to: input.email,
    subject: "Vitajte v Onko Klube ♡",
    html: renderWelcomeEmail(input.fullName),
  });
}

export function queueNewDeviceLoginEmail(input: {
  email: string;
  fullName: string;
  deviceLabel: string;
  userAgent: string;
  loginAt: Date;
}): void {
  sendTransactionalEmailAsync({
    to: input.email,
    subject: "Nové prihlásenie do Onko Klubu",
    html: renderNewDeviceLoginEmail({
      fullName: input.fullName,
      deviceLabel: input.deviceLabel,
      loginAt: input.loginAt,
    }),
  });
}

export function queueEventRegistrationEmail(input: {
  email: string;
  fullName: string;
  eventTitle: string;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  eventId: string;
}): void {
  sendTransactionalEmailAsync({
    to: input.email,
    subject: renderEventRegistrationEmailSubject(input.eventTitle),
    html: renderEventRegistrationEmail(input),
  });
}

/** Call after successful event payment (Stripe / GoPay webhook). */
export function queueEventPaymentEmail(input: {
  email: string;
  fullName: string;
  eventTitle: string;
  amountCents: number;
  currency: string;
  startsAt: Date;
  location: string | null;
  eventId: string;
}): void {
  sendTransactionalEmailAsync({
    to: input.email,
    subject: renderEventPaymentEmailSubject(input.eventTitle),
    html: renderEventPaymentEmail(input),
  });
}

export async function getOrCreateDeviceId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(DEVICE_COOKIE)?.value;
  if (existing) return existing;

  const deviceId = crypto.randomUUID();
  jar.set(DEVICE_COOKIE, deviceId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEVICE_MAX_AGE,
  });
  return deviceId;
}

export async function trackLoginDevice(input: {
  userId: string;
  email: string;
  fullName: string;
  userAgent: string;
}): Promise<void> {
  const deviceId = await getOrCreateDeviceId();
  const label = deviceLabelFromUserAgent(input.userAgent);
  const now = new Date();

  const existing = await prisma.userKnownDevice.findUnique({
    where: { userId_deviceId: { userId: input.userId, deviceId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.userKnownDevice.update({
      where: { id: existing.id },
      data: { lastSeenAt: now, userAgent: input.userAgent, label },
    });
    return;
  }

  const knownCount = await prisma.userKnownDevice.count({
    where: { userId: input.userId },
  });

  await prisma.userKnownDevice.create({
    data: {
      userId: input.userId,
      deviceId,
      label,
      userAgent: input.userAgent,
      lastSeenAt: now,
    },
  });

  if (knownCount > 0) {
    queueNewDeviceLoginEmail({
      email: input.email,
      fullName: input.fullName,
      deviceLabel: label,
      userAgent: input.userAgent,
      loginAt: now,
    });
  }
}
