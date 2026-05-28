import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <PhoneShell>
      <TopBar backHref="/welcome" />

      <div className="px-6">
        <h1 className="text-2xl font-bold text-brand-purple">Nový účet</h1>
      </div>

      <RegisterForm />
    </PhoneShell>
  );
}
