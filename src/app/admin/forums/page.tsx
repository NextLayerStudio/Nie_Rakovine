import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteForumAction, toggleForumPublishedAction } from "@/lib/actions/admin-forums";
import { forumAvatarStyle } from "@/lib/avatar-style";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";

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
          <div className="flex gap-2">
            <Link href="/admin/forums/moderation" className="admin-btn-outline">
              Schvaľovanie
            </Link>
            <Link href="/admin/forums/new" className="admin-btn-primary">
              + Nové fórum
            </Link>
          </div>
        }
      />

      <div className="admin-card overflow-hidden">
        {forums.length === 0 ? (
          <p className="p-8 text-center text-sm text-brand-purple/50">
            Zatiaľ žiadne fóra. Vytvorte prvé fórum.
          </p>
        ) : (
          <ul className="divide-y divide-brand-purple/8">
            {forums.map((f) => (
              <li key={f.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-purple/[0.02]">
                <div
                  aria-hidden
                  className="h-10 w-10 shrink-0 rounded-md bg-cover bg-center ring-1 ring-brand-purple/10"
                  style={forumAvatarStyle(f)}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-purple">
                    {f.title}
                  </p>
                  <p className="text-xs text-brand-purple/50">
                    {f._count.members} členov · {f._count.threads} príspevkov
                    {f.description && (
                      <span className="ml-2 hidden truncate sm:inline text-brand-purple/40">
                        — {f.description}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/forums/${f.id}`}
                    className="rounded bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white hover:brightness-110"
                  >
                    Spravovať
                  </Link>
                  <Link
                    href={`/home/forums/${f.id}`}
                    className="rounded border border-brand-purple/20 px-3.5 py-1.5 text-xs font-semibold text-brand-purple hover:bg-brand-purple/5"
                  >
                    Náhľad
                  </Link>
                  <form action={toggleForumPublishedAction}>
                    <input type="hidden" name="id" value={f.id} />
                    <input type="hidden" name="current" value={String(f.published)} />
                    <button
                      type="submit"
                      className={`rounded px-3.5 py-1.5 text-xs font-semibold transition ${
                        f.published
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      {f.published ? "Publikované" : "Čaká"}
                    </button>
                  </form>
                  <DeleteConfirmButton
                    action={deleteForumAction}
                    id={f.id}
                    confirmText="Naozaj chceš zmazať toto fórum? Zmažú sa aj všetky vlákna v ňom. Táto akcia je nezvratná."
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
