import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { StepFooter } from "@/components/StepFooter";

const REGIONS = [
  "Bratislavský",
  "Trnavský",
  "Trenčiansky",
  "Nitriansky",
  "Žilinský",
  "Banskobystrický",
  "Prešovský",
  "Košický",
];

// Step 1 - location
export default function LocationStep() {
  return (
    <PhoneShell>
      <TopBar
        backHref="/register/subscription"
        title="Registračný formulár"
        step={{ current: 1, total: 5 }}
      />

      <div className="px-6 text-center">
        <h2 className="text-base font-semibold text-brand-purple">
          Zvoľte si miesto v ktorom sa nachádzate
        </h2>
      </div>

      <form
        action="/register/profile/diagnosis"
        className="mt-5 flex flex-1 flex-col px-5"
      >
        <select name="region" className="input-light text-brand-purple">
          <option value="">Vyberte kraj</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <p className="my-3 text-center text-xs text-brand-purple/60">
          alebo vyberte na mape
        </p>

        {/* Map placeholder until we wire a real provider */}
        <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-[#e8e1d8]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(111,35,128,0.18) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-purple text-white shadow-lg">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9.5A2.5 2.5 0 1012 6a2.5 2.5 0 000 5.5z" />
            </svg>
          </div>
        </div>

        <div className="mt-auto">
          <button type="submit" className="btn-soft mx-auto flex w-40 justify-between">
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
