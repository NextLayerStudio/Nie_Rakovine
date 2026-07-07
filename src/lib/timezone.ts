/** All event times are entered and displayed as Slovak wall-clock time. */
export const EVENT_TIME_ZONE = "Europe/Bratislava";

/**
 * Interprets a `<input type="datetime-local">` value (e.g. "2026-07-15T17:00")
 * as wall-clock time in `timeZone` and returns the matching UTC instant.
 *
 * Needed because `new Date("2026-07-15T17:00")` treats the string as the
 * *server's* local time (UTC on Vercel), silently shifting every saved event
 * by the Bratislava/UTC offset (1-2 hours depending on DST).
 */
export function parseZonedDateTime(
  value: string,
  timeZone: string = EVENT_TIME_ZONE,
): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return new Date(value);

  const y = Number(match[1]);
  const mo = Number(match[2]);
  const d = Number(match[3]);
  const h = Number(match[4]);
  const mi = Number(match[5]);

  // Naive UTC guess using the entered wall-clock numbers, then measure how far
  // off that guess is once rendered back through the target time zone.
  const guessUtc = Date.UTC(y, mo - 1, d, h, mi);
  const renderedAsUtc = renderAsUtcMillis(new Date(guessUtc), timeZone);
  const offset = renderedAsUtc - guessUtc;
  return new Date(guessUtc - offset);
}

/** Formats a Date as a `datetime-local` input value in `timeZone` wall-clock time. */
export function toZonedDateTimeLocal(
  date: Date,
  timeZone: string = EVENT_TIME_ZONE,
): string {
  const parts = zonedParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function zonedParts(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const map: Record<string, string> = {};
  for (const p of dtf.formatToParts(date)) map[p.type] = p.value;
  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour: map.hour === "24" ? "00" : map.hour,
    minute: map.minute,
    second: map.second,
  };
}

function renderAsUtcMillis(date: Date, timeZone: string): number {
  const p = zonedParts(date, timeZone);
  return Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour),
    Number(p.minute),
    Number(p.second),
  );
}
