export function formatTimeRange(start: Date, end: Date | null): string {
  const time = new Intl.DateTimeFormat("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (end) return `${time.format(start)} - ${time.format(end)}`;
  return time.format(start);
}

export function formatEventDate(date: Date): string {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatEventWeekday(date: Date): string {
  return new Intl.DateTimeFormat("sk-SK", { weekday: "long" }).format(date);
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
