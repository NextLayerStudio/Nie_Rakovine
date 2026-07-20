import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { AboutYouForm } from "./AboutYouForm";

export const dynamic = "force-dynamic";

export default async function AboutYouStep() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar
          backHref="/register/subscription"
          title="Registračný formulár"
          step={{ current: 1, total: 2 }}
          className="[&_h1]:text-lg [&_h1]:font-bold"
        />

        <div className="shrink-0 px-6 text-center">
          <p className="text-base leading-relaxed text-brand-purple/75">
            Pomôžte nám spoznať vás o niečo lepšie, aby sme vám mohli
            prinášať informácie a obsah, ktoré sú pre vás najviac užitočné.
          </p>
        </div>

        <AboutYouForm
          defaultRegion={user.profile?.region ?? ""}
          defaultCity={user.profile?.city ?? ""}
          defaultLat={user.profile?.latitude ?? null}
          defaultLng={user.profile?.longitude ?? null}
          defaultIsPatient={user.profile?.isPatient ?? null}
          defaultDiagnosis={user.profile?.diagnosis ?? ""}
          defaultPhase={user.profile?.diagnosisPhase ?? ""}
          defaultYear={user.profile?.diagnosisYear ?? null}
          defaultCancerTypes={user.profile?.cancerTypes ?? []}
        />
      </div>
    </PhoneShell>
  );
}
