import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    profiles,
    forums,
    users,
    posts,
    events,
    newThisWeek,
    activeSubs,
    pendingThreads,
    pendingComments,
    recentUsers,
  ] = await Promise.all([
    prisma.clubProfile.count(),
    prisma.forum.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.post.count(),
    prisma.event.count(),
    prisma.user.count({
      where: { role: "USER", createdAt: { gte: weekAgo } },
    }),
    prisma.user.count({
      where: { role: "USER", subscriptionStatus: "ACTIVE" },
    }),
    prisma.forumThread.count({ where: { status: "PENDING" } }),
    prisma.forumComment.count({ where: { status: "PENDING" } }),
    prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        profile: { select: { region: true, diagnosis: true } },
      },
    }),
  ]);

  const pending = pendingThreads + pendingComments;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-brand-purple/70">
            Prehľad komunity ONKO KLUB a rýchle akcie.
          </p>
        </div>
        <Link
          href="/admin/statistics"
          className="rounded-pill bg-brand-purple px-5 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          Štatistiky registrácie →
        </Link>
      </div>

      {/* KPI row */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Členovia" value={users} sub={`+${newThisWeek} za 7 dní`} accent="purple" />
        <Kpi label="Aktívne predplatné" value={activeSubs} sub="platiaci členovia" accent="pink" />
        <Kpi label="Príspevky" value={posts} sub={`${events} podujatí`} accent="purple" />
        <Kpi
          label="Na schválenie"
          value={pending}
          sub="fóra — témy a komentáre"
          accent={pending > 0 ? "pink" : "purple"}
          href={pending > 0 ? "/admin/forums/moderation" : undefined}
        />
      </div>

      {/* Management sections */}
      <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-brand-purple/60">
        Správa obsahu
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SectionCard
          href="/admin/profiles"
          title="Profily"
          description="Instagram profily — príspevky, videá, recepty a podujatia."
          stat={`${profiles} profilov · ${posts} príspevkov · ${events} podujatí`}
        />
        <SectionCard
          href="/admin/forums"
          title="Fóra"
          description="Témy fór a príspevky publikované administrátorom."
          stat={`${forums} fór${pending > 0 ? ` · ${pending} čaká` : ""}`}
        />
        <SectionCard
          href="/admin/users"
          title="Používatelia"
          description="Registrovaní členovia — prehľad údajov z registrácie."
          stat={`${users} používateľov`}
        />
      </div>

      {/* Recent members */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-purple/60">
          Najnovší členovia
        </h2>
        <Link
          href="/admin/users"
          className="text-xs font-semibold text-brand-pink hover:underline"
        >
          Všetci →
        </Link>
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-brand-purple/10 bg-white shadow-card">
        {recentUsers.length === 0 ? (
          <p className="p-6 text-center text-sm text-brand-purple/60">
            Zatiaľ žiadni používatelia.
          </p>
        ) : (
          <ul className="divide-y divide-brand-purple/10">
            {recentUsers.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/admin/users/${u.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-brand-purple/5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand-purple">
                      {u.fullName}
                    </p>
                    <p className="truncate text-xs text-brand-purple/55">
                      {u.email}
                      {u.profile?.region ? ` · ${u.profile.region}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-brand-purple/45">
                    {new Intl.DateTimeFormat("sk-SK", {
                      dateStyle: "short",
                    }).format(u.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  accent,
  href,
}: {
  label: string;
  value: number;
  sub: string;
  accent: "purple" | "pink";
  href?: string;
}) {
  const inner = (
    <>
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
    </>
  );

  const className =
    "block rounded-2xl border border-brand-purple/10 bg-white p-5 shadow-card transition";

  if (href) {
    return (
      <Link href={href} className={`${className} hover:border-brand-pink/40`}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

function SectionCard({
  href,
  title,
  description,
  stat,
}: {
  href: string;
  title: string;
  description: string;
  stat: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-brand-purple/10 bg-white p-5 shadow-card transition hover:border-brand-purple/30"
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-xs text-brand-purple/70">{description}</p>
      <p className="mt-3 text-sm font-semibold text-brand-pink">{stat}</p>
    </Link>
  );
}
