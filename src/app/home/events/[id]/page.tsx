import { notFound } from "next/navigation";
import { FeedHeader } from "@/components/FeedHeader";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { EventRegistrationForm } from "./EventRegistrationForm";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const event = await prisma.event.findUnique({
    where: { id },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event || !event.published) notFound();

  const myRegistration = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { eventId: id, userId: user.id } },
  });

  const cover = event.coverUrl
    ? {
        backgroundImage: `url(${event.coverUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background:
          "linear-gradient(180deg, #f3c3a2 0%, #d98c80 60%, #6F2380 100%)",
      };

  const date = new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(event.startsAt);

  return (
    <>
      <FeedHeader name={user.fullName} />

      <article className="mx-4 overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="aspect-[5/3] w-full" style={cover} />
        <div className="-mt-12 rounded-t-3xl bg-brand-pink p-5 text-white">
          <h2 className="text-center text-xl font-extrabold tracking-wide">
            {event.title}
          </h2>

          {event.description && (
            <p className="mt-4 text-xs leading-relaxed text-white/90">
              {event.description}
            </p>
          )}

          <ul className="mt-4 space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <Dot /> {date}
            </li>
            {event.location && (
              <li className="flex items-center gap-2">
                <Dot /> {event.location}
              </li>
            )}
            {event.capacity ? (
              <li className="flex items-center gap-2">
                <Dot /> Voľných miest:{" "}
                {Math.max(event.capacity - event._count.registrations, 0)} /{" "}
                {event.capacity}
              </li>
            ) : null}
          </ul>

          {myRegistration ? (
            <p className="mt-5 rounded-pill bg-white/15 py-2 text-center text-xs font-semibold text-white">
              Ste prihlásení na toto podujatie
            </p>
          ) : (
            <EventRegistrationForm
              eventId={event.id}
              defaultName={user.fullName.split(" ")[0] ?? ""}
              defaultSurname={user.fullName.split(" ").slice(1).join(" ")}
            />
          )}
        </div>
      </article>

      <div className="h-6" />
    </>
  );
}

function Dot() {
  return (
    <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-white/20">
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
    </span>
  );
}
