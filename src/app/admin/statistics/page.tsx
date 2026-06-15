import Link from "next/link";
import type { CancerType } from "@prisma/client";
import { CANCER_TYPES, cancerTypeShort } from "@/lib/cancer-type";
import {
  getRegistrationStats,
  type DistributionRow,
  type StatsFilters,
  type StatsPeriod,
} from "@/lib/admin-stats";

export const dynamic = "force-dynamic";

const PERIODS: { value: StatsPeriod; label: string }[] = [
  { value: "all", label: "Celé obdobie" },
  { value: "7d", label: "7 dní" },
  { value: "30d", label: "30 dní" },
  { value: "90d", label: "90 dní" },
];

export default async function AdminStatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    cancerType?: string;
    region?: string;
    plan?: string;
    period?: string;
  }>;
}) {
  const sp = await searchParams;

  const cancerType =
    sp.cancerType && CANCER_TYPES.includes(sp.cancerType as CancerType)
      ? (sp.cancerType as CancerType)
      : null;
  const plan =
    sp.plan === "MONTHLY" || sp.plan === "YEARLY" || sp.plan === "NONE"
      ? sp.plan
      : null;
  const period: StatsPeriod = (["7d", "30d", "90d"] as const).includes(
    sp.period as "7d" | "30d" | "90d",
  )
    ? (sp.period as StatsPeriod)
    : "all";
  const region = sp.region?.trim() || null;

  const filters: StatsFilters = { cancerType, region, plan, period };
  const stats = await getRegistrationStats(filters);

  const hasFilter = !!(cancerType || region || plan || period !== "all");
  const d = stats.distributions;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Štatistiky registrácie</h1>
          <p className="mt-1 text-sm text-brand-purple/70">
            Prehľad odpovedí z registračného dotazníka. Použite filtre pre
            segmentáciu členov.
          </p>
        </div>
        <Link
          href="/admin/users"
          className="rounded-pill border border-brand-purple/30 px-4 py-2 text-sm font-semibold text-brand-purple hover:bg-brand-purple/5"
        >
          Zoznam používateľov →
        </Link>
      </div>

      {/* Filters */}
      <form
        method="get"
        className="mt-6 grid gap-3 rounded-2xl border border-brand-purple/10 bg-white p-4 shadow-card sm:grid-cols-2 lg:grid-cols-4"
      >
        <Filter label="Obdobie (registrácia)">
          <select name="period" defaultValue={period} className="stats-select">
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Filter>

        <Filter label="Typ ochorenia">
          <select
            name="cancerType"
            defaultValue={cancerType ?? ""}
            className="stats-select"
          >
            <option value="">Všetky</option>
            {CANCER_TYPES.map((t) => (
              <option key={t} value={t}>
                {cancerTypeShort(t)}
              </option>
            ))}
          </select>
        </Filter>

        <Filter label="Kraj / región">
          <select
            name="region"
            defaultValue={region ?? ""}
            className="stats-select"
          >
            <option value="">Všetky</option>
            {stats.regionsAvailable.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Filter>

        <Filter label="Predplatné">
          <select name="plan" defaultValue={plan ?? ""} className="stats-select">
            <option value="">Všetky</option>
            <option value="YEARLY">Ročné</option>
            <option value="MONTHLY">Mesačné</option>
            <option value="NONE">Žiadne</option>
          </select>
        </Filter>

        <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="rounded-pill bg-brand-purple px-6 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Použiť filtre
          </button>
          {hasFilter && (
            <Link
              href="/admin/statistics"
              className="rounded-pill border border-brand-purple/30 px-4 py-2 text-sm font-semibold text-brand-purple hover:bg-brand-purple/5"
            >
              Zrušiť filtre
            </Link>
          )}
        </div>
      </form>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi
          label="Členovia vo výbere"
          value={stats.filteredUsers}
          sub={
            hasFilter
              ? `z celkovo ${stats.totalUsers}`
              : "registrovaní používatelia"
          }
          accent="purple"
        />
        <Kpi
          label="Vyplnený profil"
          value={stats.completedProfiles}
          sub={`${stats.completionRate}% dokončilo dotazník`}
          accent="pink"
        />
        <Kpi
          label="Newsletter"
          value={stats.newsletterOptIn}
          sub="súhlas s odoberaním"
          accent="purple"
        />
        <Kpi
          label="Aktívne predplatné"
          value={stats.activeSubscriptions}
          sub="platiaci členovia"
          accent="pink"
        />
      </div>

      {stats.filteredUsers === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/60">
          Pre zvolené filtre nie sú žiadni používatelia.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Typ ochorenia"
            hint="Koľko členov uviedlo daný typ (možný viacnásobný výber)"
            rows={d.cancerTypes}
          />
          <ChartCard
            title="Záujmy"
            hint="O aké oblasti majú členovia záujem"
            rows={d.interests}
          />
          <ChartCard
            title="Čo očakávajú od členstva"
            hint="Odpovede na otázku o očakávaniach"
            rows={d.expectations}
            emptyNote="Zatiaľ bez voľných odpovedí."
          />
          <ChartCard
            title="S čím potrebujú pomôcť"
            hint="Najčastejšie potreby členov"
            rows={d.help}
          />
          <ChartCard
            title="Čo chcú získať od ONKO KLUBU"
            rows={d.gain}
          />
          <ChartCard
            title="Odkiaľ sa o nás dozvedeli"
            rows={d.hearAboutUs}
          />
          <ChartCard
            title="Fáza liečby"
            rows={d.diagnosisPhase}
            emptyNote="Zatiaľ bez údajov o fáze."
          />
          <ChartCard title="Predplatné" rows={d.plans} />
          <ChartCard
            title="Kraje / regióny"
            rows={d.regions}
            emptyNote="Zatiaľ bez údajov o lokalite."
            className="lg:col-span-2"
          />
        </div>
      )}
    </div>
  );
}

function Filter({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-brand-purple/70">
        {label}
      </span>
      {children}
    </label>
  );
}

function Kpi({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  accent: "purple" | "pink";
}) {
  return (
    <div className="rounded-2xl border border-brand-purple/10 bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-purple/60">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-extrabold ${
          accent === "pink" ? "text-brand-pink" : "text-brand-purple"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-brand-purple/55">{sub}</p>
    </div>
  );
}

function ChartCard({
  title,
  hint,
  rows,
  emptyNote = "Žiadne odpovede.",
  className = "",
}: {
  title: string;
  hint?: string;
  rows: DistributionRow[];
  emptyNote?: string;
  className?: string;
}) {
  const visible = rows.filter((r) => r.count > 0);
  const max = Math.max(1, ...visible.map((r) => r.count));

  return (
    <section
      className={`rounded-2xl border border-brand-purple/10 bg-white p-5 shadow-card ${className}`}
    >
      <h2 className="text-sm font-bold text-brand-purple">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-brand-purple/55">{hint}</p>}

      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-brand-purple/50">{emptyNote}</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {visible.map((r) => (
            <li key={r.label}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate font-medium text-brand-purple/85">
                  {r.label}
                </span>
                <span className="shrink-0 tabular-nums text-brand-purple/60">
                  {r.count} · {r.pct}%
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-brand-purple/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-pink to-brand-purple"
                  style={{ width: `${Math.round((r.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
