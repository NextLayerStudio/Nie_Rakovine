import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { subscriptionPlanLabel } from "@/lib/user-profile-display";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const users = await prisma.user.findMany({
    where: {
      role: "USER",
      ...(query
        ? {
            OR: [
              { fullName: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { profile: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="Používatelia"
        description="Vyhľadajte člena a kliknite na riadok pre kompletné údaje z registrácie."
        actions={
          <Link href="/admin/statistics" className="admin-btn-outline">
            Štatistiky →
          </Link>
        }
      />

      <form method="get" className="flex flex-wrap gap-2">
        <input
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Meno alebo e-mail…"
          className="admin-input min-w-[220px] flex-1"
        />
        <button type="submit" className="admin-btn-primary">
          Hľadať
        </button>
        {query && (
          <Link href="/admin/users" className="admin-btn-outline">
            Zrušiť filter
          </Link>
        )}
      </form>

      {query && (
        <p className="mt-3 text-xs text-brand-purple/60">
          Výsledky pre „{query}“: {users.length}{" "}
          {users.length === 1 ? "používateľ" : "používatelia"}
        </p>
      )}

      <div className="admin-card mt-4 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-purple/5 text-left text-xs uppercase tracking-wide text-brand-purple/70">
            <tr>
              <th className="px-4 py-3">Meno</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Predplatné</th>
              <th className="px-4 py-3">Diagnóza</th>
              <th className="px-4 py-3">Registrácia</th>
              <th className="px-4 py-3 text-right">Detail</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-brand-purple/60"
                >
                  {query
                    ? "Žiadny používateľ nevyhovuje hľadaniu."
                    : "Zatiaľ žiadni používatelia."}
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-brand-purple/10 transition hover:bg-brand-purple/5"
              >
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="hover:text-brand-pink hover:underline"
                  >
                    {u.fullName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-brand-purple/80">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="admin-badge bg-brand-purple/8 text-brand-purple/80">
                    {subscriptionPlanLabel(u.subscriptionPlan)}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-purple/80">
                  {u.profile?.diagnosis ?? "—"}
                </td>
                <td className="px-4 py-3 text-brand-purple/60">
                  {new Intl.DateTimeFormat("sk-SK", {
                    dateStyle: "short",
                  }).format(u.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="font-semibold text-brand-purple hover:underline"
                  >
                    Zobraziť →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
