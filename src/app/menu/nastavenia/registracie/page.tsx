import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { loadRegistrationHistory } from "@/lib/settings-data";
import { RegistrationHistoryList } from "../RegistrationHistoryList";

export const dynamic = "force-dynamic";

export default async function RegistrationHistorySettingsPage() {
  const user = await requireUser();
  const registrationHistory = await loadRegistrationHistory(user.id);

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu/nastavenia" title="História registrácií" />
        <div className="px-5 py-4">
          <RegistrationHistoryList registrations={registrationHistory} />
        </div>
      </div>
    </PhoneShell>
  );
}
