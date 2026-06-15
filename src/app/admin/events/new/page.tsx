import { EventForm } from "../EventForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ profileId?: string }>;
}) {
  const { profileId } = await searchParams;

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Nové podujatie"
        description="Vytvorte podujatie, ktoré sa zobrazí v aplikácii."
        backHref={profileId ? `/admin/profiles/${profileId}` : "/admin/profiles"}
        backLabel="Späť na profil"
      />
      <EventForm mode="create" profileId={profileId} />
    </div>
  );
}
