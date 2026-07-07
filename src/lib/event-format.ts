import { EVENT_TIME_ZONE } from "@/lib/timezone";

export function formatTimeRange(start: Date, end: Date | null): string {
  const time = new Intl.DateTimeFormat("sk-SK", {
    timeZone: EVENT_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
  if (end) return `${time.format(start)} - ${time.format(end)}`;
  return time.format(start);
}

export function formatEventDate(date: Date): string {
  return new Intl.DateTimeFormat("sk-SK", {
    timeZone: EVENT_TIME_ZONE,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatEventWeekday(date: Date): string {
  return new Intl.DateTimeFormat("sk-SK", {
    timeZone: EVENT_TIME_ZONE,
    weekday: "long",
  }).format(date);
}

export function formatRegistrationCount(
  count: number,
  capacity: number | null,
): string {
  if (capacity !== null) {
    return `${count} / ${capacity} prihlásených`;
  }
  return `${count} prihlásených`;
}
