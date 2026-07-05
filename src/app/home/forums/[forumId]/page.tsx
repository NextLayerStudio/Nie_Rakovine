import { notFound } from "next/navigation";
import { ForumDetailLayout } from "@/components/ForumDetailLayout";
import { ForumPostCard } from "@/components/ForumPostCard";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { safeReturnHref } from "@/lib/post-display";
import {
  APPROVED,
  approvedCommentsCountWhere,
  visibleThreadsWhere,
} from "@/lib/forum-moderation";

export const dynamic = "force-dynamic";

export default async function ForumDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ forumId: string }>;
  searchParams: Promise<{ pending?: string; from?: string }>;
}) {
  const { forumId } = await params;
  const { pending, from } = await searchParams;
  const backHref = safeReturnHref(from, "/home/forums");
  const user = await requireUser();

  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
    include: {
      members: { where: { userId: user.id } },
      _count: { select: { members: true } },
    },
  });

  if (!forum || !forum.published) notFound();

  const joined = forum.members.length > 0;

  const threads = await prisma.forumThread.findMany({
    where: { forumId, ...visibleThreadsWhere(user.id) },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { fullName: true } },
      _count: { select: { comments: approvedCommentsCountWhere() } },
    },
  });

  const userLikes = await prisma.forumThreadLike.findMany({
    where: { userId: user.id, threadId: { in: threads.map((t) => t.id) } },
    select: { threadId: true },
  });
  const likedThreadIds = new Set(userLikes.map((l) => l.threadId));

  return (
    <div className="forum-page min-h-full">
      <ForumDetailLayout
        backHref={backHref}
        forumId={forum.id}
        initialJoined={joined}
        imageUrl={forum.imageUrl}
        accentColor={forum.accentColor}
        title={forum.title}
        description={forum.description}
        memberCount={forum._count.members}
      >
      {pending === "1" && (
        <div className="forum-banner mx-5 mt-4 text-center">
          Príspevok bol odoslaný a čaká na schválenie administrátorom.
        </div>
      )}


      <section className="px-5 pb-24 pt-5">
        <h2 className="forum-section-label mb-4">
          Príspevky {threads.length > 0 && `(${threads.length})`}
        </h2>

        {threads.length === 0 ? (
          <div className="forum-empty">
            Zatiaľ žiadne príspevky. {joined ? "Buďte prvý/á!" : ""}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {threads.map((thread) => (
              <ForumPostCard
                key={thread.id}
                forumId={forum.id}
                threadId={thread.id}
                authorName={thread.author.fullName}
                title={thread.title}
                body={thread.body}
                coverUrl={thread.coverUrl}
                liked={likedThreadIds.has(thread.id)}
                likeCount={thread.likeCount}
                commentCount={thread._count.comments}
                isPending={thread.status !== APPROVED}
              />
            ))}
          </div>
        )}
      </section>
      </ForumDetailLayout>
    </div>
  );
}
