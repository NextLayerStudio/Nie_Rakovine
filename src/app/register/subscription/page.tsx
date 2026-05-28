import { PhoneShell } from "@/components/PhoneShell";
import { SubscriptionForm } from "./SubscriptionForm";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const user = await requireUser();
  return (
    <PhoneShell>
      <header className="px-6 pt-8 text-center">
        <h1 className="text-[22px] font-extrabold leading-tight text-brand-pink">
          Zvoľte si formu
          <br />
          predplatného
        </h1>
        <p className="mt-3 text-left text-[11px] text-brand-purple/50">
          Vitajte, {user.fullName.split(" ")[0]}
        </p>
      </header>

      <SubscriptionForm currentPlan={user.subscriptionPlan} />
    </PhoneShell>
  );
}
