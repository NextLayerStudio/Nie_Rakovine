import {
  approveCommentAction,
  approveThreadAction,
  rejectCommentAction,
  rejectThreadAction,
} from "@/lib/actions/admin-forums";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ForumModerationPage() {
  const [pendingThreads, pendingComments] = await Promise.all([
    prisma.forumThread.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        author: { select: { fullName: true, email: true } },
        forum: { select: { title: true } },
      },
    }),
    prisma.forumComment.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        author: { select: { fullName: true, email: true } },
        thread: {
          include: { forum: { select: { title: true } } },
        },
      },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Schvaľovanie fóra</h1>
      <p className="mt-1 text-sm text-brand-purple/70">
        Správy používateľov sa zobrazia ostatným až po schválení.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-purple/60">
          Príspevky ({pendingThreads.length})
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
              <p className="text-xs text-brand-purple/60">
                {t.forum.title} · {t.author.fullName} ({t.author.email})
              </p>
              {t.title && (
                <h3 className="mt-1 font-bold text-brand-purple">{t.title}</h3>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-brand-purple/90">
                {t.body}
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
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-purple/60">
          Komentáre ({pendingComments.length})
        </h2>
        <ul className="mt-3 space-y-4">
          {pendingComments.length === 0 && (
            <li className="rounded-2xl border border-dashed border-brand-purple/20 p-6 text-center text-sm text-brand-purple/60">
              Žiadne komentáre na schválenie.
            </li>
          )}
          {pendingComments.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-brand-purple/10 bg-white p-4 shadow-card"
            >
              <p className="text-xs text-brand-purple/60">
                {c.thread.forum.title} · {c.author.fullName}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-brand-purple/90">
                {c.body}
              </p>
              <div className="mt-4 flex gap-2">
                <form action={approveCommentAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="rounded-pill bg-brand-purple px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    Schváliť
                  </button>
                </form>
                <form action={rejectCommentAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="rounded-pill border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-600"
                  >
                    Zamietnuť
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
