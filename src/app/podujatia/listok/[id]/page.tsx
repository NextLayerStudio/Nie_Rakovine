import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { TicketQrCode } from "@/components/landing/TicketQrCode";
import { prisma } from "@/lib/prisma";
import { getAppUrlFromEnv } from "@/lib/email/brand";
import {
  formatEventDate,
  formatEventWeekday,
  formatTimeRange,
} from "@/lib/event-format";

export const dynamic = "force-dynamic";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ticket = await prisma.eventTicket.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      event: {
        select: {
          title: true,
          description: true,
          location: true,
          startsAt: true,
          endsAt: true,
        },
      },
    },
  });
  if (!ticket) notFound();

  const startsAt = new Date(ticket.event.startsAt);
  const endsAt = ticket.event.endsAt ? new Date(ticket.event.endsAt) : null;
  const appUrl = getAppUrlFromEnv();
  const ticketUrl = `${appUrl}/podujatia/listok/${ticket.id}`;

  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-md px-5">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#FDA4C7] to-[#6F2380] p-8 text-center text-white shadow-[0_20px_50px_rgba(111,35,128,0.25)]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/75">
              Lístok
            </p>
            <h1 className="mt-2 text-2xl font-black leading-tight">
              {ticket.event.title}
            </h1>
            <p className="mt-1 text-sm font-semibold text-white/85">
              {ticket.firstName} {ticket.lastName}
            </p>

            <div className="mt-6 flex justify-center">
              <TicketQrCode value={ticketUrl} />
            </div>

            <p className="mt-4 font-mono text-[11px] tracking-widest text-white/60">
              č. {ticket.id}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6F2380]/60">Dátum</dt>
                <dd className="text-right font-semibold text-[#6F2380]">
                  {formatEventDate(startsAt)} ({formatEventWeekday(startsAt)})
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6F2380]/60">Čas</dt>
                <dd className="text-right font-semibold text-[#6F2380]">
                  {formatTimeRange(startsAt, endsAt)}
                </dd>
              </div>
              {ticket.event.location && (
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6F2380]/60">Miesto</dt>
                  <dd className="text-right font-semibold text-[#6F2380]">
                    {ticket.event.location}
                  </dd>
                </div>
              )}
            </dl>

            {ticket.event.description && (
              <p className="mt-5 border-t border-[#FDA4C7]/15 pt-5 text-sm leading-relaxed text-[#6F2380]/80">
                {ticket.event.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
