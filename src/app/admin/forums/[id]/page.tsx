import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ForumAdminForm } from "../ForumAdminForm";
import { ForumThreadForm } from "../ForumThreadForm";
import {
  deleteForumCommentAction,
  deleteForumThreadAction,
} from "@/lib/actions/admin-forums";

export const dynamic = "force-dynamic";

export default async function EditForumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const forum = await prisma.forum.findUnique({
    where: { id },
    include: {
      threads: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { fullName: true } },
          comments: {
            orderBy: { createdAt: "asc" },
            include: { author: { select: { fullName: true } } },
          },
        },
      },
    },
  });
  if (!forum) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Upraviť fórum</h1>
      <ForumAdminForm mode="edit" forum={forum} />

      <section className="mt-10">
        <h2 className="text-lg font-bold">Príspevky vo fóre</h2>
        <p className="mt-1 text-sm text-brand-purple/70">
          Len administrátor publikuje príspevky. Používatelia ich môžu len
          čítať po zapojení sa do fóra.
        </p>

        <ForumThreadForm forumId={forum.id} />

        <ul className="mt-6 space-y-4">
          {forum.threads.length === 0 && (
            <li className="text-sm text-brand-purple/60">
              Zatiaľ žiadne príspevky.
            </li>
          )}
          {forum.threads.map((t) => (
            <li
              key={t.id}
              className="rounded-2xl border border-brand-purple/10 bg-white p-4"
            >
              <div className="flex justify-between gap-2">
                <div>
                  {t.title && (
                    <h3 className="font-bold text-brand-purple">{t.title}</h3>
                  )}
                  <p className="mt-1 whitespace-pre-wrap text-sm text-brand-purple/90">
                    {t.body}
                  </p>
                  <p className="mt-2 text-xs text-brand-purple/50">
                    {t.author.fullName}
                  </p>
                </div>
                <form action={deleteForumThreadAction}>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="forumId" value={forum.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline"
                  >
                    Zmazať
                  </button>
                </form>
              </div>
              {t.comments.length > 0 && (
                <ul className="mt-3 space-y-2 border-t border-brand-purple/10 pt-3">
                  {t.comments.map((c) => (
                    <li
                      key={c.id}
                      className="flex justify-between gap-2 text-xs"
                    >
                      <span>
                        <strong>{c.author.fullName}:</strong> {c.body}
                      </span>
                      <form action={deleteForumCommentAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="forumId" value={forum.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:underline"
                        >
                          ×
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
