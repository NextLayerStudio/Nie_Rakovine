import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [profiles, forums, users, posts, events] = await Promise.all([
    prisma.clubProfile.count(),
    prisma.forum.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.post.count(),
    prisma.event.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-brand-purple/70">
        Len administrátor vytvára obsah. Používatelia čítajú, lajkujú a
        registrujú sa na podujatia.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SectionCard
          href="/admin/profiles"
          title="Profily"
          description="Instagram profily — príspevky, videá, recepty a podujatia pod každým profilom."
          stat={`${profiles} profilov · ${posts} príspevkov · ${events} podujatí`}
        />
        <SectionCard
          href="/admin/forums"
          title="Fóra"
          description="Témy fór a príspevky publikované administrátorom."
          stat={`${forums} fór`}
        />
        <SectionCard
          href="/admin/users"
          title="Používatelia"
          description="Registrovaní členovia — iba prehľad, bez úprav obsahu."
          stat={`${users} používateľov`}
        />
      </div>
    </div>
  );
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
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-xs text-brand-purple/70">{description}</p>
      <p className="mt-3 text-sm font-semibold text-brand-pink">{stat}</p>
    </Link>
  );
}
