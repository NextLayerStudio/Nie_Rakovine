import Link from "next/link";
import type { RegistrationHistoryItem } from "@/lib/settings-data";
import { cn } from "@/lib/utils";

function formatEventDate(iso: string): string {
  return new Intl.DateTimeFormat("sk-SK", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function registrationStatusLabel(isPast: boolean): string {
  return isPast ? "Ukončené" : "Registrovaný";
}

function statusBadgeClass(isPast: boolean): string {
  return isPast
    ? "bg-brand-purple/10 text-brand-purple/60"
    : "bg-emerald-50 text-emerald-700";
}

function RegistrationRow({ item }: { item: RegistrationHistoryItem }) {
  const startsAt = new Date(item.startsAt);
  const isPast = startsAt.getTime() < Date.now();
  const statusLabel = registrationStatusLabel(isPast);
  const content = (
    <>
      <div
        aria-hidden
        className={cn(
          "h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-brand-purple/10 bg-cover bg-center",
          !item.coverUrl && "grid place-items-center text-brand-purple/35",
        )}
        style={item.coverUrl ? { backgroundImage: `url(${item.coverUrl})` } : undefined}
      >
        {!item.coverUrl && <CalendarIcon />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-brand-purple">
          {item.title}
        </p>
        <p className="mt-0.5 text-xs text-brand-purple/60">
          {formatEventDate(item.startsAt)}
        </p>
        {item.location && (
          <p className="mt-0.5 truncate text-[11px] text-brand-purple/45">
            {item.location}
          </p>
        )}
      </div>
      <span
        className={cn(
          "shrink-0 rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
          statusBadgeClass(isPast),
        )}
      >
        {statusLabel}
      </span>
    </>
  );

  const className =
    "flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-brand-purple/5";

  if (item.published) {
    return (
      <li>
        <Link href={`/home/events/${item.eventId}`} className={className}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li className={cn(className, "cursor-default opacity-80")}>{content}</li>
  );
}

export function RegistrationHistoryList({
  registrations,
}: {
  registrations: RegistrationHistoryItem[];
}) {
  if (registrations.length === 0) {
    return (
      <p className="rounded-2xl bg-brand-purple/[0.03] px-4 py-6 text-center text-sm text-brand-purple/55">
        Zatiaľ ste sa neregistrovali na žiadne podujatie.
      </p>
    );
  }

  const now = Date.now();
  const upcoming = registrations.filter(
    (item) => new Date(item.startsAt).getTime() >= now,
  );
  const past = registrations.filter(
    (item) => new Date(item.startsAt).getTime() < now,
  );

  return (
    <div className="space-y-5">
      {upcoming.length > 0 && (
        <HistoryGroup title="Nadchádzajúce" items={upcoming} />
      )}
      {past.length > 0 && (
        <HistoryGroup title="Minulé podujatia" items={past} />
      )}
    </div>
  );
}

function HistoryGroup({
  title,
  items,
}: {
  title: string;
  items: RegistrationHistoryItem[];
}) {
  return (
    <div>
      <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-brand-purple/45">
        {title}
      </p>
      <ul className="divide-y divide-brand-purple/8 rounded-2xl border border-brand-purple/8 bg-brand-purple/[0.02]">
        {items.map((item) => (
          <RegistrationRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
