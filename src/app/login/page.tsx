import { NieRakovineLogo, NieRakovineMark } from "@/components/OnkoLogo";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: nextRaw } = await searchParams;
  const next = nextRaw === "/admin" ? "/admin" : nextRaw ?? "";
  const isAdminLogin = next === "/admin";

  return (
    <PhoneShell>
      <TopBar backHref="/welcome" className="login-topbar" />

      <div className="px-6">
        <h1 className="text-3xl font-bold text-brand-purple">
          {isAdminLogin ? "Admin prihlásenie" : "Prihlásenie"}
        </h1>
        <p className="mt-1 text-sm text-brand-purple/60">
          {isAdminLogin ? "Správa ONKO KLUBU" : "Vitajte späť"}
        </p>
      </div>

      <LoginForm next={next} isAdminLogin={isAdminLogin} />

      <div className="flex items-end justify-between gap-4 px-6 pb-8 pt-4">
        <NieRakovineLogo />
        <NieRakovineMark />
      </div>
    </PhoneShell>
  );
}
