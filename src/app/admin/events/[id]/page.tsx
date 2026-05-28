import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm } from "../EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: {
        include: { user: { select: { email: true, fullName: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!event) notFound();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold">Upraviť podujatie</h1>
        <p className="mt-1 text-sm text-brand-purple/70">
          Zmeny sa prejavia v aplikácii ihneď po uložení.
        </p>
        <EventForm mode="edit" event={event} />
      </div>

      <aside>
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-purple/70">
          Registrácie ({event.registrations.length})
        </h2>
        <ul className="mt-3 space-y-2">
          {event.registrations.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-brand-purple/10 bg-white p-3 text-sm shadow-card"
            >
              <p className="font-semibold">
                {r.name ?? r.user.fullName} {r.surname ?? ""}
              </p>
              <p className="text-xs text-brand-purple/60">{r.user.email}</p>
            </li>
          ))}
          {event.registrations.length === 0 && (
            <li className="rounded-xl border border-dashed border-brand-purple/30 p-3 text-center text-xs text-brand-purple/60">
              Žiadne registrácie zatiaľ.
            </li>
          )}
        </ul>
      </aside>
    </div>
  );
}
