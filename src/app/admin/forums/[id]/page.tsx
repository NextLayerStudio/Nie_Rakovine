import Link from "next/link";
import { notFound } from "next/navigation";
import { ForumPostCard } from "@/components/ForumPostCard";
import { AdminItemActions } from "@/components/admin/AdminItemActions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { deleteForumThreadAction } from "@/lib/actions/admin-forums";
import { prisma } from "@/lib/prisma";
import { ForumOverviewCard } from "../ForumOverviewCard";
import { ForumThreadForm } from "../ForumThreadForm";

export const dynamic = "force-dynamic";

function ThreadStatusBadge({
  status,
}: {
  status: "PENDING" | "APPROVED" | "REJECTED";
}) {
  switch (status) {
    case "APPROVED":
      return (
        <span className="rounded-pill bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          Schválené
        </span>
      );
    case "PENDING":
      return (
        <span className="rounded-pill bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
          Čaká
        </span>
      );
    case "REJECTED":
      return (
        <span className="rounded-pill bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
          Zamietnuté
        </span>
      );
  }
}

export default async function AdminForumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const forum = await prisma.forum.findUnique({
    where: { id },
    include: {
      _count: { select: { members: true, threads: true } },
      threads: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { fullName: true } },
          _count: { select: { comments: true } },
        },
      },
    },
  });
  if (!forum) notFound();

  return (
    <div>
      <AdminPageHeader
        title={forum.title}
        description="Správa fóra a príspevkov"
        backHref="/admin/forums"
        backLabel="Späť na fóra"
        actions={
          <Link
            href={`/home/forums/${forum.id}`}
            className="admin-btn-outline"
          >
            Náhľad v aplikácii →
          </Link>
        }
      />

      <ForumOverviewCard
        forum={forum}
        memberCount={forum._count.members}
        threadCount={forum._count.threads}
      />

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="admin-section-title text-sm">Príspevky vo fóre</h2>
            <p className="mt-1 text-xs text-brand-purple/60">
              Náhľad ako v aplikácii · max. 2 v riadku
            </p>
          </div>
        </div>

        <ForumThreadForm forumId={forum.id} />

        {forum.threads.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/55">
            Zatiaľ žiadne príspevky.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {forum.threads.map((thread) => (
              <ForumPostCard
                key={thread.id}
                forumId={forum.id}
                threadId={thread.id}
                authorName={thread.author.fullName}
                title={thread.title}
                body={thread.body}
                coverUrl={thread.coverUrl}
                liked={false}
                likeCount={thread.likeCount}
                commentCount={thread._count.comments}
                compact
                className="h-full"
                statusBadge={<ThreadStatusBadge status={thread.status} />}
                footerSlot={
                  <AdminItemActions
                    editHref={`/home/forums/${forum.id}/${thread.id}`}
                    deleteAction={deleteForumThreadAction}
                    id={thread.id}
                    editLabel="Náhľad"
                    compact
                    hiddenFields={{ forumId: forum.id }}
                  />
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
