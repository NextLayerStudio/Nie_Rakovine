import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { PatientStatusForm } from "./PatientStatusForm";

export const dynamic = "force-dynamic";

export default async function PatientStatusStep() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar
          backHref="/register/profile/location"
          title="Registračný formulár"
          step={{ current: 2, total: 6 }}
          className="[&_h1]:text-lg [&_h1]:font-bold"
        />

        <div className="shrink-0 px-6 text-center">
          <p className="text-base leading-relaxed text-brand-purple/75">
            Aby sme vám vedeli ponúknuť ten správny obsah, povedzte nám, či
            ste onkologický pacient, alebo sa o niekoho blízkeho staráte či
            chcete komunitu jednoducho podporiť.
          </p>
          <h2 className="mt-4 text-lg font-bold text-brand-purple">
            Ste pacient s diagnózou?
          </h2>
        </div>

        <PatientStatusForm
          defaultIsPatient={user.profile?.isPatient ?? null}
        />
      </div>
    </PhoneShell>
  );
}
