import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { AccountForm } from "./AccountForm";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const user = await requireUser();

  // Accounts created before the first/last name split only have fullName —
  // best-effort split it so the form isn't blank for them.
  const [fallbackFirstName, ...fallbackLastNameParts] = user.fullName
    .trim()
    .split(/\s+/);
  const firstName = user.firstName ?? fallbackFirstName ?? "";
  const lastName = user.lastName ?? fallbackLastNameParts.join(" ");

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu/nastavenia" title="Účet" />
        <AccountForm firstName={firstName} lastName={lastName} email={user.email} />
      </div>
    </PhoneShell>
  );
}
