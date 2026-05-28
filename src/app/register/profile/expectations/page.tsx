import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { EXPECTATIONS_OPTIONS, HELP_OPTIONS } from "@/lib/constants";
import { ExpectationsForm } from "./ExpectationsForm";

export const dynamic = "force-dynamic";

export default async function ExpectationsStep() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <TopBar
        backHref="/register/profile/interests"
        title="Registračný formulár"
        step={{ current: 4, total: 5 }}
      />

      <ExpectationsForm
        expectationsOptions={EXPECTATIONS_OPTIONS}
        helpOptions={HELP_OPTIONS}
        defaultExpectations={
          user.profile?.expectations.filter(
            (e) => !e.startsWith("pomoc: ") && !e.startsWith("získať: "),
          ) ?? []
        }
        defaultHelp={
          user.profile?.expectations
            .filter((e) => e.startsWith("pomoc: "))
            .map((e) => e.replace(/^pomoc:\s*/, "")) ?? []
        }
      />
    </PhoneShell>
  );
}
