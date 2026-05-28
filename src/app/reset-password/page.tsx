import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <PhoneShell>
      <TopBar backHref="/login" />

      <div className="px-6">
        <h1 className="text-2xl font-bold text-brand-purple">Zmena hesla</h1>
        <p className="mt-1 text-xs text-brand-purple/60">
          Nastavte si nové heslo
        </p>
      </div>

      <ResetPasswordForm />
    </PhoneShell>
  );
}
