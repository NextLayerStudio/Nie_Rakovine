import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm } from "../EventForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";
import { removeEventAttendeeAction } from "@/lib/actions/events";
import { EVENT_TIME_ZONE } from "@/lib/timezone";

export const dynamic = "force-dynamic";

type Attendee = {
  id: string;
  name: string;
  email: string;
  isMember: boolean;
  registeredAt: Date;
  ticketId: string;
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      tickets: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!event) notFound();

  // Every attendee — member or guest — has exactly one EventTicket row;
  // `userId` tells us which is which.
  const attendees: Attendee[] = event.tickets.map((t) => ({
    id: t.id,
    name: `${t.firstName} ${t.lastName}`.trim(),
    email: t.email,
    isMember: t.userId !== null,
    registeredAt: t.createdAt,
    ticketId: t.id,
  }));

  const dateFormat = new Intl.DateTimeFormat("sk-SK", {
    timeZone: EVENT_TIME_ZONE,
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <AdminPageHeader
        title="Upraviť podujatie"
        description="Zmeny sa prejavia v aplikácii ihneď po uložení."
        backHref={
          event.profileId
            ? `/admin/profiles/${event.profileId}`
            : "/admin/profiles"
        }
        backLabel="Späť na profil"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="max-w-2xl lg:order-2">
          <EventForm mode="edit" event={event} />
        </div>

        <aside className="order-first lg:order-1">
          <h2 className="admin-section-title">
            Zúčastnení ({attendees.length})
          </h2>
          <div className="mt-3 space-y-2">
            {attendees.map((a) => (
              <details key={a.id} className="admin-card p-3 text-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
                  <span className="font-semibold text-brand-purple">{a.name}</span>
                  <span
                    className={`shrink-0 rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      a.isMember
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {a.isMember ? "Člen" : "Nečlen"}
                  </span>
                </summary>
                <div className="mt-2 space-y-1 text-xs text-brand-purple/60">
                  <p>{a.email}</p>
                  <p>Zaregistrovaný: {dateFormat.format(a.registeredAt)}</p>
                  <p>
                    {a.isMember
                      ? "Registrácia v aplikácii"
                      : "Registrácia z verejnej stránky (lístok)"}
                  </p>
                  <a
                    href={`/podujatia/listok/${a.ticketId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block font-semibold text-brand-pink underline"
                  >
                    Zobraziť lístok →
                  </a>
                  <div className="pt-1.5">
                    <DeleteConfirmButton
                      action={removeEventAttendeeAction}
                      id={a.id}
                      label="Odstrániť z podujatia"
                      confirmText={`Naozaj odstrániť ${a.name} z tohto podujatia?`}
                      extraFields={{ eventId: id }}
                    />
                  </div>
                </div>
              </details>
            ))}
            {attendees.length === 0 && (
              <div className="rounded-md border border-dashed border-brand-purple/30 p-3 text-center text-xs text-brand-purple/60">
                Žiadne registrácie zatiaľ.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
