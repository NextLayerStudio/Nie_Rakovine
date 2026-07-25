import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PublicEventsHeader } from "@/components/landing/PublicEventsHeader";
import { PublicEventsFooter } from "@/components/landing/PublicEventsFooter";
import { EventGuestTicketForm } from "@/components/landing/EventGuestTicketForm";
import { EventRegistrationForm } from "@/app/home/events/[id]/EventRegistrationForm";
import { EVENT_CATEGORY_META } from "@/lib/event-category";
import { regionLabel } from "@/lib/event-region";
import { formatRegistrationCount } from "@/lib/event-format";
import { EVENT_TIME_ZONE } from "@/lib/timezone";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PodujatieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findFirst({
    where: { id, published: true },
    include: { _count: { select: { registrations: true, tickets: true } } },
  });
  if (!event) notFound();

  const registrationCount = event._count.registrations + event._count.tickets;
  const isFull = event.capacity !== null && registrationCount >= event.capacity;
  const isMembersOnly = event.visibility === "MEMBERS_ONLY";

  const user = await getCurrentUser();
  const myRegistration = user
    ? await prisma.eventRegistration.findUnique({
        where: { eventId_userId: { eventId: id, userId: user.id } },
      })
    : null;

  const date = new Intl.DateTimeFormat("sk-SK", {
    timeZone: EVENT_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(event.startsAt);

  const nameParts = user?.fullName.trim().split(/\s+/).filter(Boolean) ?? [];

  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <PublicEventsHeader
        left={
          <Link
            href="/podujatia"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6F2380]/70 hover:text-[#6F2380]"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Všetky podujatia</span>
          </Link>
        }
      />

      <section className="pt-[60px] pb-16 md:pt-[68px]">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#6F2380]/10">
            {event.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.coverUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#FDA4C7] to-[#6F2380]" />
            )}

            {event.category && (
              <span
                className="absolute right-4 top-4 rounded-pill px-3 py-1.5 text-xs font-bold uppercase tracking-wide"
                style={{
                  background: EVENT_CATEGORY_META[event.category].color,
                  color: EVENT_CATEGORY_META[event.category].text,
                }}
              >
                {EVENT_CATEGORY_META[event.category].label}
              </span>
            )}
          </div>

          <div className="flex flex-col px-5 py-8 md:px-12 md:py-14">
            <h1 className="text-2xl font-black leading-tight text-[#6F2380] md:text-3xl">
              {event.title}
            </h1>

            <div className="mt-4 space-y-1.5 text-sm text-[#6F2380]/70">
              <p className="font-semibold">{date}</p>
              {event.location && <p>{event.location}</p>}
              {event.region && <p>{regionLabel(event.region)}</p>}
              <p className="text-[#6F2380]/50">
                {formatRegistrationCount(registrationCount, event.capacity)}
              </p>
            </div>

            {isMembersOnly && (
              <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-pill bg-[#6F2380]/8 px-3 py-1.5 text-xs font-bold text-[#6F2380]">
                🔒 Podujatie určené najmä členom ONKO KLUBU
              </p>
            )}

            {event.description && (
              <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-[#6F2380]/75">
                {event.description}
              </p>
            )}

            {user ? (
              <div className="mt-6 rounded-2xl bg-brand-pink p-5 text-white">
                {isFull ? (
                  <p className="text-center text-sm font-bold text-white/80">
                    Kapacita podujatia je naplnená.
                  </p>
                ) : myRegistration ? (
                  <p className="text-center text-sm font-bold">
                    Ste prihlásení na toto podujatie.
                  </p>
                ) : (
                  <>
                    <p className="mb-1 text-sm font-bold">Prihlásiť sa na podujatie</p>
                    <EventRegistrationForm
                      eventId={event.id}
                      defaultName={nameParts[0] ?? ""}
                      defaultSurname={nameParts.slice(1).join(" ")}
                      accentClassName="bg-[#FDA4C7]"
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="mt-6">
                {isFull ? (
                  <p className="rounded-2xl bg-white p-5 text-center text-sm font-bold text-[#6F2380]/60 shadow-sm ring-1 ring-[#6F2380]/10">
                    Kapacita podujatia je naplnená.
                  </p>
                ) : (
                  <EventGuestTicketForm eventId={event.id} eventTitle={event.title} />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <PublicEventsFooter />
    </main>
  );
}
