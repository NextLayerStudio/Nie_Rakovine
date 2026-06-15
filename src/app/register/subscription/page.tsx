import { PhoneShell } from "@/components/PhoneShell";
import { SubscriptionForm } from "./SubscriptionForm";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <header className="shrink-0 px-6 pt-8 text-center">
          <h1 className="text-[22px] font-extrabold leading-tight text-brand-pink">
            Zvoľte si formu
            <br />
            predplatného
          </h1>
          <p className="mx-auto mt-4 max-w-[320px] text-center text-sm leading-relaxed text-brand-purple/75">
            Vďaka vášmu členstvu môžeme spoločne budovať priestor plný podpory,
            porozumenia a užitočných aktivít pre ľudí s onkologickým ochorením a
            ich blízkych.
          </p>
        </header>

        <SubscriptionForm currentPlan={user.subscriptionPlan} />
      </div>
    </PhoneShell>
  );
}
