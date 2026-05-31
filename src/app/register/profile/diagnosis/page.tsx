import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { DiagnosisForm } from "./DiagnosisForm";

export const dynamic = "force-dynamic";

export default async function DiagnosisStep() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <TopBar
        backHref="/register/profile/location"
        title="Registračný formulár"
        step={{ current: 2, total: 5 }}
      />

      <div className="px-6 text-center">
        <h2 className="text-base font-semibold text-brand-purple">
          Vaša diagnóza
        </h2>
      </div>

      <DiagnosisForm
        defaultDiagnosis={user.profile?.diagnosis ?? ""}
        defaultPhase={user.profile?.diagnosisPhase ?? ""}
        defaultYear={user.profile?.diagnosisYear ?? null}
        defaultCancerTypes={user.profile?.cancerTypes ?? []}
      />
    </PhoneShell>
  );
}
