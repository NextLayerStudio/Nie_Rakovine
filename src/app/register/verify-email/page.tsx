import { redirect } from "next/navigation";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { getCurrentUser } from "@/lib/auth";
import { VerifyEmailForm } from "./VerifyEmailForm";

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.emailVerified) redirect("/register/subscription");

  return (
    <PhoneShell>
      <TopBar backHref="/welcome" title="Overenie e-mailu" />

      <div className="px-6">
        <h1 className="text-2xl font-bold text-brand-purple">
          Overte svoj e-mail
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-purple/70">
          Na adresu{" "}
          <span className="font-semibold text-brand-purple">{user.email}</span>{" "}
          sme poslali 6-miestny overovací kód. Zadajte ho nižšie a dokončite
          registráciu.
        </p>
      </div>

      <VerifyEmailForm />
    </PhoneShell>
  );
}
