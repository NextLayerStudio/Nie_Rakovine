import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { HEAR_ABOUT_US_OPTIONS } from "@/lib/constants";
import { SourceForm } from "./SourceForm";

export const dynamic = "force-dynamic";

export default async function SourceStep() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar
          backHref="/register/profile/expectations"
          title="Registračný formulár"
          step={{ current: 6, total: 6 }}
          className="[&_h1]:text-lg [&_h1]:font-bold"
        />

        <SourceForm
          hearOptions={HEAR_ABOUT_US_OPTIONS}
          defaultHear={user.profile?.hearAboutUs ?? []}
        />
      </div>
    </PhoneShell>
  );
}
