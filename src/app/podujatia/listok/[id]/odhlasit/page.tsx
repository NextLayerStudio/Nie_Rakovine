import { notFound } from "next/navigation";
import { PublicEventsHeader } from "@/components/landing/PublicEventsHeader";
import { PublicEventsFooter } from "@/components/landing/PublicEventsFooter";
import { CookieConsentBanner } from "@/components/landing/CookieConsentBanner";
import { CancelTicketForm } from "@/components/landing/CancelTicketForm";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatTimeRange } from "@/lib/event-format";

export const dynamic = "force-dynamic";

export default async function CancelTicketPage({
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
      event: { select: { title: true, startsAt: true, endsAt: true } },
    },
  });
  if (!ticket) notFound();

  const startsAt = new Date(ticket.event.startsAt);
  const endsAt = ticket.event.endsAt ? new Date(ticket.event.endsAt) : null;

  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <PublicEventsHeader />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-md px-5">
          <p className="mb-3 text-center text-sm font-bold uppercase tracking-widest text-[#FDA4C7]">
            Odhlásenie z podujatia
          </p>
          <h1 className="mb-2 text-center text-xl font-black leading-tight text-[#6F2380]">
            {ticket.event.title}
          </h1>
          <p className="mb-6 text-center text-sm text-[#6F2380]/60">
            {formatEventDate(startsAt)} · {formatTimeRange(startsAt, endsAt)}
          </p>
          <p className="mb-6 text-center text-sm text-[#6F2380]/75">
            Naozaj sa chcete odhlásiť z tohto podujatia, {ticket.firstName}?
          </p>

          <CancelTicketForm ticketId={ticket.id} />
        </div>
      </section>

      <PublicEventsFooter />
      <CookieConsentBanner />
    </main>
  );
}
