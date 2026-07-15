import Link from "next/link";
import { NieRakovineLogo, OnkoLogo } from "@/components/OnkoLogo";
import { PhoneShell } from "@/components/PhoneShell";
import { normalizePlanParam } from "@/lib/preselected-plan";

export const dynamic = "force-dynamic";

/** Welcome / landing — layout per design mockup (white screen, logos, two CTAs). */
export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; amount?: string }>;
}) {
  const { plan: planRaw, amount } = await searchParams;
  const plan = normalizePlanParam(planRaw);

  // A plan (e.g. from the Supporter donate button on /cennik) carries
  // through to registration via ?plan=/&amount= (picked up by sessionStorage
  // once on /register), or — for an existing member choosing to log in
  // instead — straight to the checkout step via the login's ?next=.
  const registerHref = plan
    ? `/register?plan=${planRaw}${amount ? `&amount=${amount}` : ""}`
    : "/register";
  const loginHref = plan
    ? `/login?next=${encodeURIComponent(
        `/register/subscription/checkout?plan=${plan}${amount ? `&amount=${amount}` : ""}`,
      )}`
    : "/login";

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col bg-white">
        <div className="welcome-top flex shrink-0 justify-center px-8">
          <NieRakovineLogo priority className="w-[150px]" />
        </div>

        <div className="flex flex-1 items-center justify-center px-8">
          <OnkoLogo
            size="2xl"
            priority
            className="welcome-logo max-h-[560px] w-auto"
          />
        </div>

        <div
          className="welcome-bottom shrink-0 px-8"
          style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom))" }}
        >
          <p className="mb-5 text-center text-base leading-relaxed text-brand-purple/80">
            {plan === "SUPPORTER" && amount
              ? `Ešte krok k daru vo výške ${amount} € — prihláste sa, alebo si vytvorte účet.`
              : "Miesto podpory a porozumenia na ceste s onkologickým ochorením."}
          </p>

          <div className="welcome-buttons flex w-full flex-col gap-3">
            <Link
              href={loginHref}
              className="rounded-pill bg-brand-pink py-5 text-center text-xl font-bold text-white shadow-soft transition hover:brightness-105 active:scale-[0.99]"
            >
              Prihlásiť sa
            </Link>
            <Link
              href={registerHref}
              className="rounded-pill bg-brand-pink-register py-5 text-center text-xl font-bold text-white shadow-soft transition hover:brightness-105 active:scale-[0.99]"
            >
              Registrovať sa
            </Link>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
