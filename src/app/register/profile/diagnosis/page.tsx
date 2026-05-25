import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";

const PHASES = ["1. fáza", "2. fáza", "3. fáza", "4. fáza", "Remisia"];

// Step 2 - diagnosis
export default function DiagnosisStep() {
  return (
    <PhoneShell>
      <TopBar
        backHref="/register/profile/location"
        title="Registračný formulár"
        step={{ current: 2, total: 5 }}
      />

      <div className="px-6 text-center">
        <h2 className="text-base font-semibold text-brand-purple">
          Napíšte vašu diagnózu
        </h2>
      </div>

      <form
        action="/register/profile/interests"
        className="mt-5 flex flex-1 flex-col gap-3 px-5"
      >
        <input
          name="diagnosis"
          type="text"
          placeholder="napr. karcinóm prsníka"
          className="input-light"
        />

        <div>
          <label className="label" htmlFor="phase">
            Fáza liečby
          </label>
          <select
            id="phase"
            name="phase"
            className="input-light text-brand-purple"
          >
            <option value="">Vyberte fázu</option>
            {PHASES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="year">
            Rok diagnostikovania
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min="1950"
            max={new Date().getFullYear()}
            placeholder="napr. 2024"
            className="input-light"
          />
        </div>

        <div className="mt-auto pb-2">
          <button type="submit" className="btn-secondary mx-auto flex w-40 justify-between">
            Ďalej
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>

      <div className="h-6" />
    </PhoneShell>
  );
}
