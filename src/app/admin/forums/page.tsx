import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteForumAction } from "@/lib/actions/admin-forums";
import { forumAvatarStyle } from "@/lib/avatar-style";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminForumsPage() {
  const forums = await prisma.forum.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { members: true, threads: true } },
    },
  });

  return (
    <div>
      <AdminPageHeader
        title="Fóra"
        description="Admin vytvára fóra. Používatelia píšu správy — admin ich schvaľuje."
        actions={
          <>
            <Link href="/admin/forums/moderation" className="admin-btn-outline">
              Schvaľovanie
            </Link>
            <Link href="/admin/forums/new" className="admin-btn-primary">
              + Nové fórum
            </Link>
          </>
        }
      />

      <div className="admin-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-purple/5 text-left text-xs uppercase tracking-wide text-brand-purple/70">
            <tr>
              <th className="px-4 py-3">Fórum</th>
              <th className="px-4 py-3">Členovia</th>
              <th className="px-4 py-3">Príspevky</th>
              <th className="px-4 py-3">Stav</th>
              <th className="px-4 py-3 text-right">Akcie</th>
            </tr>
          </thead>
          <tbody>
            {forums.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-brand-purple/60"
                >
                  Zatiaľ žiadne fóra. Vytvorte prvé fórum.
                </td>
              </tr>
            )}
            {forums.map((f) => (
              <tr
                key={f.id}
                className="border-t border-brand-purple/10 transition hover:bg-brand-purple/5"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden
                      className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center ring-1 ring-brand-purple/10"
                      style={forumAvatarStyle(f)}
                    />
                    <span className="font-semibold text-brand-purple">
                      {f.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-brand-purple/80">
                  {f._count.members}
                </td>
                <td className="px-4 py-3 text-brand-purple/80">
                  {f._count.threads}
                </td>
                <td className="px-4 py-3">
                  {f.published ? (
                    <span className="admin-badge bg-emerald-50 text-emerald-700">
                      Publikované
                    </span>
                  ) : (
                    <span className="admin-badge bg-amber-50 text-amber-700">
                      Čaká na schválenie
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/forums/${f.id}`}
                      className="text-xs font-semibold text-brand-purple hover:underline"
                    >
                      Spravovať →
                    </Link>
                    <form action={deleteForumAction}>
                      <input type="hidden" name="id" value={f.id} />
                      <button type="submit" className="admin-link-danger">
                        Zmazať
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
