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
      <TopBar
        backHref="/register/profile/expectations"
        title="Registračný formulár"
        step={{ current: 5, total: 5 }}
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
    </PhoneShell>
  );
}
