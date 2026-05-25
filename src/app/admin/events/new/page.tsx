// New event form. The server action will be wired to Prisma once
// the database is connected.
export default function NewEventPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Nové podujatie</h1>
      <p className="mt-1 text-sm text-brand-purple/70">
        Vytvorte podujatie, ktoré sa zobrazí v aplikácii.
      </p>

      <form
        action="/admin/events"
        method="post"
        className="mt-6 space-y-4 rounded-2xl border border-brand-purple/10 bg-white p-6 shadow-card"
      >
        <Field label="Názov" name="title" placeholder="napr. ONKO YOGA" />
        <Field
          label="Krátky popis"
          name="description"
          placeholder="Niekoľko viet o podujatí"
          textarea
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Začiatok" name="startsAt" type="datetime-local" />
          <Field label="Koniec" name="endsAt" type="datetime-local" />
        </div>
        <Field
          label="Miesto"
          name="location"
          placeholder="Adresa alebo online odkaz"
        />
        <Field
          label="Kapacita"
          name="capacity"
          type="number"
          placeholder="napr. 15"
        />
        <Field
          label="Cover (URL)"
          name="coverUrl"
          placeholder="https://..."
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="reset"
            className="rounded-pill border border-brand-purple/30 px-4 py-2 text-sm"
          >
            Zrušiť
          </button>
          <button
            type="submit"
            className="rounded-pill bg-brand-purple px-5 py-2 text-sm font-semibold text-white"
          >
            Uložiť
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-brand-purple/80">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border border-brand-purple/20 bg-white px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className="w-full rounded-xl border border-brand-purple/20 bg-white px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
        />
      )}
    </label>
  );
}
