import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteEventAction } from "@/lib/actions/events";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startsAt: "desc" },
    include: { _count: { select: { registrations: true } } },
  });

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
              <th className="px-4 py-3">Reg.</th>
              <th className="px-4 py-3">Stav</th>
              <th className="px-4 py-3 text-right">Akcie</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-brand-purple/60"
                >
                  Žiadne podujatia. Vytvorte prvé pomocou tlačidla vyššie.
                </td>
              </tr>
            )}
            {events.map((event) => (
              <tr key={event.id} className="border-t border-brand-purple/10">
                <td className="px-4 py-3 font-medium">{event.title}</td>
                <td className="px-4 py-3 text-brand-purple/80">
                  {new Intl.DateTimeFormat("sk-SK", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(event.startsAt)}
                </td>
                <td className="px-4 py-3 text-brand-purple/80">
                  {event.location ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {event._count.registrations}
                  {event.capacity ? ` / ${event.capacity}` : ""}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-pill px-2 py-0.5 text-[10px] font-semibold ${event.published ? "bg-green-100 text-green-700" : "bg-brand-purple/10 text-brand-purple"}`}
                  >
                    {event.published ? "Publikované" : "Skryté"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="mr-3 text-brand-purple underline-offset-2 hover:underline"
                  >
                    Upraviť
                  </Link>
                  <form
                    action={deleteEventAction}
                    className="inline"
                  >
                    <input type="hidden" name="id" value={event.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-600 hover:underline"
                    >
                      Zmazať
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
