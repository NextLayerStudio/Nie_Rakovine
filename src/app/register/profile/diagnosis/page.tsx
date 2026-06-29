import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { DiagnosisForm } from "./DiagnosisForm";

export const dynamic = "force-dynamic";

export default async function DiagnosisStep() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar
          backHref="/register/profile/location"
          title="Registračný formulár"
          step={{ current: 2, total: 5 }}
          className="[&_h1]:text-lg [&_h1]:font-bold"
        />

        <div className="shrink-0 px-6 text-center">
          <p className="text-base leading-relaxed text-brand-purple/75">
            Každý príbeh je iný. Informácia o vašej diagnóze nám umožní ponúkať
            obsah a aktivity, ktoré môžu byť pre vás najviac užitočné.
          </p>
          <h2 className="mt-4 text-lg font-bold text-brand-purple">
            Prosím, uveďte svoju diagnózu.
          </h2>
        </div>

        <DiagnosisForm
          defaultDiagnosis={user.profile?.diagnosis ?? ""}
          defaultPhase={user.profile?.diagnosisPhase ?? ""}
          defaultYear={user.profile?.diagnosisYear ?? null}
          defaultCancerTypes={user.profile?.cancerTypes ?? []}
        />
      </div>
    </PhoneShell>
  );
}
