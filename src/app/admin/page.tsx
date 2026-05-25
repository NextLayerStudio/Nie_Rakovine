import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Prehľad</h1>
      <p className="mt-2 text-sm text-brand-purple/70">
        Vitajte v administračnom rozhraní. Tu môžete spravovať podujatia,
        obsah a používateľov ONKO KLUBU.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminCard
          href="/admin/events"
          title="Podujatia"
          description="Vytvorte a spravujte podujatia (napr. ONKO YOGA)."
        />
        <AdminCard
          href="/admin/posts"
          title="Obsah"
          description="Pridávajte videá, články a recepty pre členov."
        />
        <AdminCard
          href="/admin/users"
          title="Používatelia"
          description="Prehľad registrovaných členov a ich predplatného."
        />
      </div>
    </div>
  );
}

function AdminCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-brand-purple/10 bg-white p-5 shadow-card transition hover:border-brand-purple/30"
    >
      <h2 className="text-base font-bold">{title}</h2>
      <p className="mt-1 text-xs text-brand-purple/70">{description}</p>
    </Link>
  );
}
