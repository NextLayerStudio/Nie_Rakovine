import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm } from "../EventForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="max-w-2xl">
          <EventForm mode="edit" event={event} />
        </div>

        <aside>
          <h2 className="admin-section-title">
            Registrácie ({event.registrations.length})
          </h2>
          <ul className="mt-3 space-y-2">
            {event.registrations.map((r) => (
              <li
                key={r.id}
                className="admin-card p-3 text-sm"
              >
                <p className="font-semibold text-brand-purple">
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
    </div>
  );
}
