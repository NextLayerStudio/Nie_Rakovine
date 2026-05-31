import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { LocationForm } from "./LocationForm";

export const dynamic = "force-dynamic";

export default async function LocationStep() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <TopBar
        backHref="/register/subscription"
        title="Registračný formulár"
        step={{ current: 1, total: 5 }}
      />

      <div className="px-6 text-center">
        <h2 className="text-base font-semibold text-brand-purple">
          Zvoľte si miesto v ktorom sa nachádzate
        </h2>
      </div>

      <LocationForm
        defaultRegion={user.profile?.region ?? ""}
        defaultCity={user.profile?.city ?? ""}
        defaultLat={user.profile?.latitude ?? null}
        defaultLng={user.profile?.longitude ?? null}
      />
    </PhoneShell>
  );
}
