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
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar
          backHref="/register/profile/interests"
          title="Registračný formulár"
          step={{ current: 4, total: 5 }}
          className="[&_h1]:text-lg [&_h1]:font-bold"
        />

        <div className="shrink-0 px-6 text-center">
          <p className="text-base leading-relaxed text-brand-purple/75">
            Naším cieľom je čo najviac vás podporiť. Vaše odpovede nám pomôžu lepšie
            pochopiť, čo od členstva očakávate a akú pomoc práve potrebujete.
          </p>
        </div>

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
          defaultConsentMembership={user.profile?.consentMembership ?? false}
          defaultConsentNewsletter={user.profile?.consentNewsletter ?? false}
        />
      </div>
    </PhoneShell>
  );
}
