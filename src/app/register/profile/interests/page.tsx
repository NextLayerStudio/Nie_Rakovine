import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import {
  EXPECTATIONS_OPTIONS,
  HEAR_ABOUT_US_OPTIONS,
  HELP_OPTIONS,
  INTEREST_OPTIONS,
} from "@/lib/constants";
import { MembershipDetailsForm } from "./MembershipDetailsForm";

export const dynamic = "force-dynamic";

export default async function MembershipDetailsStep() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar
          backHref="/register/profile/location"
          title="Registračný formulár"
          step={{ current: 2, total: 2 }}
          className="[&_h1]:text-lg [&_h1]:font-bold"
        />

        <div className="shrink-0 px-6 text-center">
          <p className="text-base leading-relaxed text-brand-purple/75">
            Sme tu pre vás. Naším cieľom je čo najviac vás podporiť — vaše
            odpovede nám pomôžu lepšie pochopiť, čo od členstva očakávate.
          </p>
        </div>

        <MembershipDetailsForm
          interestsOptions={INTEREST_OPTIONS}
          expectationsOptions={EXPECTATIONS_OPTIONS}
          helpOptions={HELP_OPTIONS}
          hearAboutUsOptions={HEAR_ABOUT_US_OPTIONS}
          defaultInterests={user.profile?.interests ?? []}
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
          defaultHearAboutUs={user.profile?.hearAboutUs ?? []}
          defaultConsentMembership={user.profile?.consentMembership ?? false}
          defaultConsentNewsletter={user.profile?.consentNewsletter ?? false}
        />
      </div>
    </PhoneShell>
  );
}
