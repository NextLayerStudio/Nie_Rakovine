import { EventForm } from "../EventForm";

export default function NewEventPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Nové podujatie</h1>
      <p className="mt-1 text-sm text-brand-purple/70">
        Vytvorte podujatie, ktoré sa zobrazí v aplikácii.
      </p>

      <EventForm mode="create" />
    </div>
  );
}
