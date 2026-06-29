import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { LocationForm } from "./LocationForm";

export const dynamic = "force-dynamic";

export default async function LocationStep() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar
          backHref="/register/subscription"
          title="Registračný formulár"
          step={{ current: 1, total: 5 }}
          className="[&_h1]:text-lg [&_h1]:font-bold"
        />

        <div className="shrink-0 px-6 text-center">
          <p className="text-base leading-relaxed text-brand-purple/75">
            Pomôžte nám spoznať vás o niečo lepšie, aby sme vám mohli prinášať
            informácie o aktivitách a stretnutiach vo vašom okolí.
          </p>
          <h2 className="mt-4 text-lg font-bold text-brand-purple">
            Zvoľte mesto, v ktorom sa nachádzate:
          </h2>
        </div>

        <LocationForm
          defaultRegion={user.profile?.region ?? ""}
          defaultCity={user.profile?.city ?? ""}
          defaultLat={user.profile?.latitude ?? null}
          defaultLng={user.profile?.longitude ?? null}
        />
      </div>
    </PhoneShell>
  );
}
