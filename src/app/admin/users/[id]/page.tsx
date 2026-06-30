import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  splitProfileExpectations,
  subscriptionPlanLabel,
  subscriptionStatusLabel,
} from "@/lib/user-profile-display";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id, role: "USER" },
    include: {
      profile: true,
      _count: {
        select: {
          forumMemberships: true,
          eventRegistrations: true,
          profileFollows: true,
          forumThreads: true,
          forumComments: true,
        },
      },
      eventRegistrations: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { event: { select: { title: true, startsAt: true } } },
      },
      forumMemberships: {
        include: { forum: { select: { title: true } } },
      },
    },
  });

  if (!user) notFound();

  const p = user.profile;
  const expectations = p ? splitProfileExpectations(p.expectations) : null;

  return (
    <div>
      <Link
        href="/admin/users"
        className="text-sm font-semibold text-brand-purple hover:underline"
      >
        ← Späť na používateľov
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          <p className="mt-1 text-sm text-brand-purple/70">{user.email}</p>
        </div>
        <p className="text-xs text-brand-purple/50">
          Registrácia:{" "}
          {new Intl.DateTimeFormat("sk-SK", {
            dateStyle: "long",
            timeStyle: "short",
          }).format(user.createdAt)}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Účet">
          <Row label="Meno" value={user.fullName} />
          <Row label="E-mail" value={user.email} />
          <Row
            label="Dátum narodenia"
            value={
              user.birthDate
                ? new Intl.DateTimeFormat("sk-SK", {
                    dateStyle: "long",
                  }).format(user.birthDate)
                : null
            }
          />
        </Section>

        <Section title="Predplatné">
          <Row
            label="Balíček"
            value={subscriptionPlanLabel(user.subscriptionPlan)}
          />
          <Row
            label="Stav"
            value={subscriptionStatusLabel(user.subscriptionStatus)}
          />
          <Row
            label="Od"
            value={
              user.subscriptionStart
                ? formatDate(user.subscriptionStart)
                : null
            }
          />
          <Row
            label="Do"
            value={
              user.subscriptionEnd ? formatDate(user.subscriptionEnd) : null
            }
          />
        </Section>

        <Section title="Lokalita (registrácia)">
          <Row label="Kraj / región" value={p?.region} />
          <Row label="Mesto" value={p?.city} />
          <Row
            label="GPS"
            value={
              p?.latitude != null && p?.longitude != null
                ? `${p.latitude}, ${p.longitude}`
                : null
            }
          />
        </Section>

        <Section title="Diagnóza">
          <Row label="Diagnóza" value={p?.diagnosis} />
          <Row label="Fáza liečby" value={p?.diagnosisPhase} />
          <Row
            label="Rok diagnózy"
            value={p?.diagnosisYear?.toString()}
          />
        </Section>

        <Section title="Záujmy" className="lg:col-span-2">
          <TagList items={p?.interests ?? []} empty="Neuvedené" />
        </Section>

        <Section title="Očakávania od komunity">
          <TagList
            items={expectations?.general ?? []}
            empty="Neuvedené"
          />
        </Section>

        <Section title="S čím potrebujem pomôcť">
          <TagList items={expectations?.help ?? []} empty="Neuvedené" />
        </Section>

        <Section title="Čo očakávam od ONKO KLUBU" className="lg:col-span-2">
          <TagList items={expectations?.gain ?? []} empty="Neuvedené" />
        </Section>

        <Section title="Odkiaľ som sa dozvedel/a" className="lg:col-span-2">
          <TagList items={p?.hearAboutUs ?? []} empty="Neuvedené" />
        </Section>

        <Section title="Aktivita v aplikácii">
          <Row
            label="Fóra (členstvo)"
            value={String(user._count.forumMemberships)}
          />
          <Row
            label="Sledované profily"
            value={String(user._count.profileFollows)}
          />
          <Row
            label="Registrácie na podujatia"
            value={String(user._count.eventRegistrations)}
          />
          <Row
            label="Príspevky vo fóre"
            value={String(user._count.forumThreads)}
          />
          <Row
            label="Komentáre vo fóre"
            value={String(user._count.forumComments)}
          />
        </Section>

        {user.forumMemberships.length > 0 && (
          <Section title="Členstvo vo fórach">
            <ul className="space-y-1 text-sm text-brand-purple/90">
              {user.forumMemberships.map((m) => (
                <li key={m.id}>• {m.forum.title}</li>
              ))}
            </ul>
          </Section>
        )}

        {user.eventRegistrations.length > 0 && (
          <Section title="Nedávne registrácie na podujatia">
            <ul className="space-y-2 text-sm">
              {user.eventRegistrations.map((r) => (
                <li key={r.id} className="text-brand-purple/90">
                  <span className="font-medium">{r.event.title}</span>
                  <span className="ml-2 text-xs text-brand-purple/50">
                    {formatDate(r.event.startsAt)}
                  </span>
                  {(r.name || r.surname) && (
                    <span className="block text-xs text-brand-purple/60">
                      {[r.name, r.surname].filter(Boolean).join(" ")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      {!p && (
        <p className="mt-6 rounded-lg border border-dashed border-brand-purple/20 p-4 text-sm text-brand-purple/60">
          Používateľ zatiaľ nedokončil profil po registrácii (žiadne údaje z
          krokov profilu).
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-brand-purple/10 bg-white p-5 shadow-card ${className}`}
    >
      <h2 className="text-sm font-bold uppercase tracking-wide text-brand-purple/70">
        {title}
      </h2>
      <div className="mt-3 divide-y divide-brand-purple/10">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm first:pt-0 last:pb-0">
      <span className="shrink-0 font-medium text-brand-purple/70">{label}</span>
      <span className="text-right text-brand-purple">
        {value?.trim() ? value : "—"}
      </span>
    </div>
  );
}

function TagList({
  items,
  empty,
}: {
  items: string[];
  empty: string;
}) {
  if (items.length === 0) {
    return <p className="py-2 text-sm text-brand-purple/50">{empty}</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2 py-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md bg-brand-purple/10 px-3 py-1 text-xs font-medium text-brand-purple"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("sk-SK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
