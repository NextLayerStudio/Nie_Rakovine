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
      <TopBar
        backHref="/register/profile/diagnosis"
        title="Registračný formulár"
        step={{ current: 3, total: 5 }}
      />

      <div className="px-6 text-center">
        <h2 className="text-base font-semibold text-brand-purple">
          O čo máte záujem?
        </h2>
      </div>

      <InterestsForm
        options={INTEREST_OPTIONS}
        defaultSelected={user.profile?.interests ?? []}
      />
    </PhoneShell>
  );
}
