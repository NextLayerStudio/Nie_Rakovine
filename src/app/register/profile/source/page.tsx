import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { GAIN_OPTIONS, HEAR_ABOUT_US_OPTIONS } from "@/lib/constants";
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
          step={{ current: 5, total: 5 }}
          className="[&_h1]:text-lg [&_h1]:font-bold"
        />

        <SourceForm
          gainOptions={GAIN_OPTIONS}
          hearOptions={HEAR_ABOUT_US_OPTIONS}
          defaultGain={
            user.profile?.expectations
              .filter((e) => e.startsWith("získať: "))
              .map((e) => e.replace(/^získať:\s*/, "")) ?? []
          }
          defaultHear={user.profile?.hearAboutUs ?? []}
        />
      </div>
    </PhoneShell>
  );
}
