import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <PhoneShell>
      <TopBar backHref="/login" />

      <div className="px-6">
        <h1 className="text-2xl font-bold text-brand-purple">Zabudnuté heslo</h1>
        <p className="mt-1 text-xs leading-relaxed text-brand-purple/60">
          Zadajte svoj e-mail a pošleme vám bezpečný odkaz na nastavenie nového
          hesla. Odkaz je platný 30 minút.
        </p>
      </div>

      <ResetPasswordForm />
    </PhoneShell>
  );
}
