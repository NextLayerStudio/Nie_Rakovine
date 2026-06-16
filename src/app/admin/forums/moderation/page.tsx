import { forumAvatarStyle } from "@/lib/avatar-style";
import {
  approveForumAction,
  approveThreadAction,
  rejectForumAction,
  rejectThreadAction,
} from "@/lib/actions/admin-forums";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function ForumModerationPage() {
  const [pendingForums, pendingThreads] = await Promise.all([
    prisma.forum.findMany({
      where: { published: false, createdById: { not: null } },
      orderBy: { createdAt: "asc" },
      include: {
        createdBy: { select: { fullName: true, email: true } },
        _count: { select: { members: true } },
      },
    }),
    prisma.forumThread.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        author: { select: { fullName: true, email: true } },
        forum: { select: { id: true, title: true } },
      },
    }),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Schvaľovanie fóra"
        description="Schvaľujte nové fóra a príspevky od používateľov. Komentáre v chate sa zobrazujú hneď."
        backHref="/admin/forums"
        backLabel="Späť na fóra"
      />

      <section className="mt-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-purple/60">
          Nové fóra na schválenie ({pendingForums.length})
        </h2>
        <ul className="mt-3 space-y-4">
          {pendingForums.length === 0 && (
            <li className="rounded-2xl border border-dashed border-brand-purple/20 p-6 text-center text-sm text-brand-purple/60">
              Žiadne fóra na schválenie.
            </li>
          )}
          {pendingForums.map((f) => (
            <li
              key={f.id}
              className="flex items-start gap-4 rounded-2xl border border-brand-purple/10 bg-white p-4 shadow-card"
            >
              <div
                aria-hidden
                className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center"
                style={forumAvatarStyle(f)}
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-brand-purple">{f.title}</h3>
                {f.createdBy && (
                  <p className="mt-0.5 text-xs text-brand-purple/60">
                    Od: {f.createdBy.fullName} ({f.createdBy.email})
                  </p>
                )}
                {f.description && (
                  <p className="mt-1 text-sm text-brand-purple/80">
                    {f.description}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <form action={approveForumAction}>
                    <input type="hidden" name="id" value={f.id} />
                    <button
                      type="submit"
                      className="rounded-pill bg-brand-purple px-4 py-1.5 text-xs font-semibold text-white"
                    >
                      Schváliť
                    </button>
                  </form>
                  <form action={rejectForumAction}>
                    <input type="hidden" name="id" value={f.id} />
                    <button
                      type="submit"
                      className="rounded-pill border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-600"
                    >
                      Zamietnuť
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-purple/60">
          Príspevky na schválenie ({pendingThreads.length})
        </h2>
        <ul className="mt-3 space-y-4">
          {pendingThreads.length === 0 && (
            <li className="rounded-2xl border border-dashed border-brand-purple/20 p-6 text-center text-sm text-brand-purple/60">
              Žiadne príspevky na schválenie.
            </li>
          )}
          {pendingThreads.map((t) => (
            <li
              key={t.id}
              className="rounded-2xl border border-brand-purple/10 bg-white p-4 shadow-card"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs text-brand-purple/60">
                  Fórum: {t.forum.title}
                </p>
                {t.title && (
                  <h3 className="mt-1 font-bold text-brand-purple">{t.title}</h3>
                )}
                <p className="mt-1 line-clamp-3 text-sm text-brand-purple/80">
                  {t.body}
                </p>
                <p className="mt-1 text-xs text-brand-purple/60">
                  Od: {t.author.fullName} ({t.author.email})
                </p>
                <div className="mt-4 flex gap-2">
                  <form action={approveThreadAction}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      className="rounded-pill bg-brand-purple px-4 py-1.5 text-xs font-semibold text-white"
                    >
                      Schváliť
                    </button>
                  </form>
                  <form action={rejectThreadAction}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      className="rounded-pill border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-600"
                    >
                      Zamietnuť
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
