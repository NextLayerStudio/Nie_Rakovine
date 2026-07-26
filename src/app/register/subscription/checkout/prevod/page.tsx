import Link from "next/link";
import { redirect } from "next/navigation";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { generatePaymentQR } from "@/lib/pay-by-square";

export const dynamic = "force-dynamic";

export default async function PrevodPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await requireUser();
  const { next } = await searchParams;
  const nextHref = next?.startsWith("/") ? next : "/home";

  if (
    user.paymentMethod !== "BANK_TRANSFER" ||
    !user.paymentVariableSymbol ||
    !user.paymentAmountEuro
  ) {
    redirect(nextHref);
  }

  const iban = process.env.PAYMENT_IBAN ?? "";
  const swift = process.env.PAYMENT_SWIFT ?? "";
  const recipient = process.env.PAYMENT_RECIPIENT_NAME ?? "onkoklub.sk";
  const variableSymbol = user.paymentVariableSymbol;
  const amount = user.paymentAmountEuro;

  let qrCodeDataUrl: string | null = null;
  if (iban) {
    try {
      const result = await generatePaymentQR({
        amount,
        iban,
        swift,
        variableSymbol,
        message: "Clenstvo ONKO KLUB",
        recipient,
      });
      qrCodeDataUrl = result.qrCodeDataUrl;
    } catch (err) {
      console.error("[prevod] QR generation failed:", err);
    }
  }

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/register/subscription" title="Platba prevodom" />

        <header className="shrink-0 px-6 pt-2 text-center">
          <h1 className="text-[22px] font-extrabold leading-tight text-brand-pink">
            Zaplaťte prevodom
          </h1>
          <p className="mx-auto mt-4 max-w-[320px] text-center text-sm leading-relaxed text-brand-purple/75">
            Naskenujte QR kód vo svojej bankovej appke, alebo si údaje
            opíšte ručne. Členstvo aktivujeme, keď platbu prijmeme na účet.
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-4 px-5 pb-6">
          {qrCodeDataUrl && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-brand-purple/10 bg-white p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeDataUrl}
                alt="Pay by Square QR kód"
                width={200}
                height={200}
                className="h-[200px] w-[200px] rounded-lg"
              />
              <p className="text-center text-xs text-brand-purple/50">
                Naskenujte vo svojej bankovej aplikácii
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-brand-purple/10 bg-white p-4 text-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-purple/50">
              Platobné údaje na ručné opísanie
            </p>
            <dl className="flex flex-col gap-2">
              {iban && <PayRow label="IBAN" value={formatIban(iban)} mono />}
              <PayRow label="Suma" value={`${amount} €`} bold />
              <PayRow label="Variabilný symbol" value={variableSymbol} mono />
              <PayRow label="Správa pre príjemcu" value="Clenstvo ONKO KLUB" />
            </dl>
          </div>

          <p className="px-1 text-xs leading-relaxed text-brand-purple/50">
            Platbu môžete vykonať teraz alebo kedykoľvek neskôr — platobné
            údaje vám pošleme aj na e-mail. Do appky môžete pokračovať už teraz.
          </p>
        </div>

        <div className="sticky bottom-0 shrink-0 border-t border-brand-purple/5 bg-white px-6 py-5">
          <Link
            href={nextHref}
            className="mx-auto flex w-full max-w-[280px] items-center justify-center gap-2 rounded-pill bg-brand-pink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-105"
          >
            Pokračovať →
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}

function formatIban(iban: string): string {
  return iban.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
}

function PayRow({
  label,
  value,
  mono,
  bold,
}: {
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-brand-purple/50">{label}</dt>
      <dd
        className={`text-right text-brand-purple ${mono ? "font-mono" : ""} ${bold ? "font-bold" : "font-semibold"}`}
      >
        {value}
      </dd>
    </div>
  );
}
