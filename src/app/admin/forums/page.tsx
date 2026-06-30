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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {forums.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/60">
            Zatiaľ žiadne fóra. Vytvorte prvé fórum.
          </p>
        )}
        {forums.map((f) => (
          <article
            key={f.id}
            className="admin-card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start gap-4 p-4">
              <div
                aria-hidden
                className="h-16 w-16 shrink-0 rounded-lg bg-cover bg-center ring-1 ring-brand-purple/10"
                style={forumAvatarStyle(f)}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold leading-snug text-brand-purple">
                    {f.title}
                  </h2>
                  <span
                    className={`admin-badge shrink-0 ${
                      f.published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {f.published ? "Publikované" : "Čaká"}
                  </span>
                </div>
                {f.description && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-brand-purple/65">
                    {f.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="admin-badge bg-brand-purple/8 text-brand-purple/80">
                    {f._count.members} členov
                  </span>
                  <span className="admin-badge bg-brand-purple/8 text-brand-purple/80">
                    {f._count.threads} príspevkov
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-3 border-t border-brand-purple/8 px-4 py-3">
              <Link
                href={`/admin/forums/${f.id}`}
                className="text-xs font-semibold text-brand-purple hover:underline"
              >
                Spravovať →
              </Link>
              <Link
                href={`/home/forums/${f.id}`}
                className="text-xs font-medium text-brand-purple/60 hover:underline"
              >
                Náhľad
              </Link>
              <form action={deleteForumAction} className="ml-auto">
                <input type="hidden" name="id" value={f.id} />
                <button type="submit" className="admin-link-danger">
                  Zmazať
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
