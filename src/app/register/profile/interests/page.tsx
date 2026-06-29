import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { INTEREST_OPTIONS } from "@/lib/constants";
import { InterestsForm } from "./InterestsForm";

export const dynamic = "force-dynamic";

export default async function InterestsStep() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar
          backHref="/register/profile/diagnosis"
          title="Registračný formulár"
          step={{ current: 3, total: 5 }}
          className="[&_h1]:text-lg [&_h1]:font-bold"
        />

        <div className="shrink-0 px-6 text-center">
          <p className="text-base leading-relaxed text-brand-purple/75">
            Sme tu pre vás. Dajte nám vedieť, o aké aktivity máte záujem.
          </p>
        </div>

        <div className="mt-10 shrink-0 px-6 text-center">
          <h2 className="text-2xl font-bold text-brand-purple">
            O čo máte záujem?
          </h2>
        </div>

        <InterestsForm
          options={INTEREST_OPTIONS}
          defaultSelected={user.profile?.interests ?? []}
        />
      </div>
    </PhoneShell>
  );
}
