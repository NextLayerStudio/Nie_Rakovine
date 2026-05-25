import { CheckboxList } from "@/components/CheckboxList";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { GAIN_OPTIONS, HEAR_ABOUT_US_OPTIONS } from "@/lib/constants";

// Step 5 - what ONKO KLUB will give them + how they heard about us
export default function SourceStep() {
  return (
    <PhoneShell>
      <TopBar
        backHref="/register/profile/expectations"
        title="Registračný formulár"
        step={{ current: 5, total: 5 }}
      />

      <form
        action="/register/profile/done"
        className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-2"
      >
        <h2 className="text-center text-base font-semibold text-brand-purple">
          Čo od ONKO KLUBU očakávate?
        </h2>
        <CheckboxList name="gain" options={GAIN_OPTIONS} />

        <h3 className="text-center text-sm font-semibold text-brand-purple">
          S čím by sme Vám vedeli pomôcť?
        </h3>
        <CheckboxList name="hearAboutUs" options={HEAR_ABOUT_US_OPTIONS} />

        <div className="flex justify-center pt-2">
          <button type="submit" className="btn-secondary w-40">
            Hotovo
          </button>
        </div>
      </form>

      <div className="h-4" />
    </PhoneShell>
  );
}
