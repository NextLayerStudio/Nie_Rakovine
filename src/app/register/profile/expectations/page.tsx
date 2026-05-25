import { CheckboxList } from "@/components/CheckboxList";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { EXPECTATIONS_OPTIONS, HELP_OPTIONS } from "@/lib/constants";

// Step 4 - what they expect + what we can help with
export default function ExpectationsStep() {
  return (
    <PhoneShell>
      <TopBar
        backHref="/register/profile/interests"
        title="Registračný formulár"
        step={{ current: 4, total: 5 }}
      />

      <form
        action="/register/profile/source"
        className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-2"
      >
        <h2 className="text-center text-base font-semibold text-brand-purple">
          Čo od ONKO KLUBU očakávate?
        </h2>
        <CheckboxList name="expectations" options={EXPECTATIONS_OPTIONS} />

        <h3 className="text-center text-sm font-semibold text-brand-purple">
          S čím by sme Vám vedeli pomôcť?
        </h3>
        <CheckboxList name="help" options={HELP_OPTIONS} />

        <div className="flex justify-center pt-2">
          <button type="submit" className="btn-secondary w-40 justify-between">
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

      <div className="h-4" />
    </PhoneShell>
  );
}
