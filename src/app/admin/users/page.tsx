import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { profile: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Používatelia</h1>
      <p className="mt-1 text-sm text-brand-purple/70">
        Zoznam registrovaných členov ONKO KLUBU.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-brand-purple/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-brand-purple/5 text-left text-xs uppercase tracking-wide text-brand-purple/70">
            <tr>
              <th className="px-4 py-3">Meno</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rola</th>
              <th className="px-4 py-3">Predplatné</th>
              <th className="px-4 py-3">Diagnóza</th>
              <th className="px-4 py-3">Registrácia</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-brand-purple/60"
                >
                  Žiadni používatelia.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-t border-brand-purple/10">
                <td className="px-4 py-3 font-medium">{u.fullName}</td>
                <td className="px-4 py-3 text-brand-purple/80">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-pill px-2 py-0.5 text-[10px] font-semibold ${u.role === "ADMIN" ? "bg-brand-purple text-white" : "bg-brand-purple/10 text-brand-purple"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-purple/80">
                  {u.subscriptionPlan === "NONE" ? "—" : u.subscriptionPlan}
                </td>
                <td className="px-4 py-3 text-brand-purple/80">
                  {u.profile?.diagnosis ?? "—"}
                </td>
                <td className="px-4 py-3 text-brand-purple/60">
                  {new Intl.DateTimeFormat("sk-SK", {
                    dateStyle: "short",
                  }).format(u.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
