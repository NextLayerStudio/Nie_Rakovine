import { PublicEventsHeader } from "@/components/landing/PublicEventsHeader";
import { PublicEventsFooter } from "@/components/landing/PublicEventsFooter";
import { CookieConsentBanner } from "@/components/landing/CookieConsentBanner";
import { CancelRegistrationForm } from "@/components/landing/CancelRegistrationForm";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatTimeRange } from "@/lib/event-format";

export const dynamic = "force-dynamic";

export default async function CancelRegistrationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const registration = await prisma.eventRegistration.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      event: { select: { title: true, startsAt: true, endsAt: true } },
      user: { select: { fullName: true } },
    },
  });

  const firstName =
    registration?.name?.trim() || registration?.user.fullName.trim().split(/\s+/)[0] || "";

  // Submitting the cancel form below re-renders this page server-side as
  // part of the same request, so once the registration is deleted,
  // `registration` is null here too — that's the *expected* post-cancellation
  // state, not an error, so we show a friendly message instead of a 404.
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <PublicEventsHeader />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-md px-5">
          {registration ? (
            <>
              <p className="mb-3 text-center text-sm font-bold uppercase tracking-widest text-[#FDA4C7]">
                Odhlásenie z podujatia
              </p>
              <h1 className="mb-2 text-center text-xl font-black leading-tight text-[#6F2380]">
                {registration.event.title}
              </h1>
              <p className="mb-6 text-center text-sm text-[#6F2380]/60">
                {formatEventDate(new Date(registration.event.startsAt))} ·{" "}
                {formatTimeRange(
                  new Date(registration.event.startsAt),
                  registration.event.endsAt ? new Date(registration.event.endsAt) : null,
                )}
              </p>
              <p className="mb-6 text-center text-sm text-[#6F2380]/75">
                Naozaj sa chcete odhlásiť z tohto podujatia{firstName ? `, ${firstName}` : ""}?
              </p>

              <CancelRegistrationForm registrationId={registration.id} />
            </>
          ) : (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#6F2380]/10">
              <h2 className="text-lg font-black text-[#6F2380]">Odhlásenie prebehlo</h2>
              <p className="mt-2 text-sm text-[#6F2380]/70">
                Táto registrácia už bola zrušená, alebo tento odkaz už nie je platný.
              </p>
            </div>
          )}
        </div>
      </section>

      <PublicEventsFooter />
      <CookieConsentBanner />
    </main>
  );
}
