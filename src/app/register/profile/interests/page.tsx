import { CheckboxList } from "@/components/CheckboxList";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { INTEREST_OPTIONS } from "@/lib/constants";

// Step 3 - interests
export default function InterestsStep() {
  return (
    <PhoneShell>
      <TopBar
        backHref="/register/profile/diagnosis"
        title="Registračný formulár"
        step={{ current: 3, total: 5 }}
      />

      <div className="px-6 text-center">
        <h2 className="text-base font-semibold text-brand-purple">
          O čo máte záujem?
        </h2>
      </div>

      <form
        action="/register/profile/expectations"
        className="mt-5 flex flex-1 flex-col gap-4 px-5"
      >
        <CheckboxList name="interests" options={INTEREST_OPTIONS} />

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
