import Link from "next/link";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { isPasswordResetTokenValid } from "@/lib/password-reset";
import { SetNewPasswordForm } from "./SetNewPasswordForm";

export const dynamic = "force-dynamic";

export default async function SetNewPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const valid = await isPasswordResetTokenValid(token);

  return (
    <PhoneShell>
      <TopBar backHref="/login" />

      <div className="px-6">
        <h1 className="text-2xl font-bold text-brand-purple">Nové heslo</h1>
        <p className="mt-1 text-xs leading-relaxed text-brand-purple/60">
          {valid
            ? "Nastavte si nové heslo pre svoj účet."
            : "Odkaz je neplatný alebo jeho platnosť vypršala."}
        </p>
      </div>

      {valid ? (
        <SetNewPasswordForm token={token} />
      ) : (
        <div className="mt-6 flex flex-col items-start gap-4 px-6">
          <p className="text-sm leading-relaxed text-brand-purple/70">
            Tento odkaz na zmenu hesla je neplatný alebo mu vypršala platnosť
            (30 minút) — prípadne už bol použitý. Požiadajte o nový odkaz.
          </p>
          <Link
            href="/reset-password"
            className="btn-secondary inline-flex px-6 py-2.5 text-sm"
          >
            Požiadať o nový odkaz
          </Link>
        </div>
      )}
    </PhoneShell>
  );
}
