import Link from "next/link";

// Stub list - will be replaced once Prisma is connected.
const PLACEHOLDER_EVENTS = [
  {
    id: "yoga-2026-06-14",
    title: "ONKO YOGA",
    startsAt: "2026-06-14T10:00",
    location: "Trnavská cesta 25, Bratislava",
    registrations: 7,
  },
];

export default function AdminEventsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Podujatia</h1>
        <Link
          href="/admin/events/new"
          className="rounded-pill bg-brand-purple px-4 py-2 text-sm font-semibold text-white"
        >
          + Nové podujatie
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-purple/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-brand-purple/5 text-left text-xs uppercase tracking-wide text-brand-purple/70">
            <tr>
              <th className="px-4 py-3">Názov</th>
              <th className="px-4 py-3">Začiatok</th>
              <th className="px-4 py-3">Miesto</th>
              <th className="px-4 py-3">Registrácie</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {PLACEHOLDER_EVENTS.map((event) => (
              <tr key={event.id} className="border-t border-brand-purple/10">
                <td className="px-4 py-3 font-medium">{event.title}</td>
                <td className="px-4 py-3 text-brand-purple/80">
                  {event.startsAt.replace("T", " ")}
                </td>
                <td className="px-4 py-3 text-brand-purple/80">
                  {event.location}
                </td>
                <td className="px-4 py-3">{event.registrations}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="text-brand-purple underline-offset-2 hover:underline"
                  >
                    Upraviť
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
