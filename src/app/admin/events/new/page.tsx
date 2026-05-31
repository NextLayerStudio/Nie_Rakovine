import { EventForm } from "../EventForm";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ profileId?: string }>;
}) {
  const { profileId } = await searchParams;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Nové podujatie</h1>
      <p className="mt-1 text-sm text-brand-purple/70">
        Vytvorte podujatie, ktoré sa zobrazí v aplikácii.
      </p>
      <EventForm mode="create" profileId={profileId} />
    </div>
  );
}
