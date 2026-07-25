import Link from "next/link";
import type { EventCategory, EventRegion } from "@prisma/client";
import { EVENT_CATEGORY_META } from "@/lib/event-category";
import { regionLabel } from "@/lib/event-region";
import { formatEventDate, formatRegistrationCount, formatTimeRange } from "@/lib/event-format";

export type PublicEvent = {
  id: string;
  title: string;
  description: string | null;
  category: EventCategory | null;
  coverUrl: string | null;
  location: string | null;
  region: EventRegion | null;
  startsAt: string;
  endsAt: string | null;
  capacity: number | null;
  visibility: "PUBLIC" | "MEMBERS_ONLY";
  registrationCount: number;
};

export function EventCard({ event }: { event: PublicEvent }) {
  const startsAt = new Date(event.startsAt);
  const endsAt = event.endsAt ? new Date(event.endsAt) : null;
  const isFull =
    event.capacity !== null && event.registrationCount >= event.capacity;
  const isMembersOnly = event.visibility === "MEMBERS_ONLY";

  return (
    <Link
      href={`/podujatia/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#6F2380]/10 transition hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#6F2380]/10">
        {event.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.coverUrl}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#FDA4C7] to-[#6F2380]" />
        )}
        {event.category && (
          <span
            className="absolute left-3 top-3 rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
            style={{
              background: EVENT_CATEGORY_META[event.category].color,
              color: EVENT_CATEGORY_META[event.category].text,
            }}
          >
            {EVENT_CATEGORY_META[event.category].label}
          </span>
        )}
        {isMembersOnly && (
          <span className="absolute right-3 top-3 rounded-pill bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white">
            🔒 Pre členov
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#FDA4C7]">
          {formatEventDate(startsAt)} · {formatTimeRange(startsAt, endsAt)}
        </p>
        <h3 className="text-base font-bold leading-snug text-[#6F2380]">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-sm text-[#6F2380]/65 line-clamp-2">
            {event.description}
          </p>
        )}
        {(event.location || event.region) && (
          <p className="text-xs text-[#6F2380]/55">
            {[event.location, regionLabel(event.region)].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="mt-auto flex flex-col gap-2.5 pt-3">
          <p className="text-xs font-semibold text-[#6F2380]/60">
            {formatRegistrationCount(event.registrationCount, event.capacity)}
          </p>
          {isFull ? (
            <span className="rounded-full bg-[#6F2380]/10 py-3 text-center text-sm font-bold text-[#6F2380]/60">
              Obsadené
            </span>
          ) : (
            <span className="rounded-full bg-[#FDA4C7] py-3 text-center text-sm font-black text-white">
              Zobraziť
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
