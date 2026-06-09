import { notFound } from "next/navigation";
import { ForumDetailHeader } from "@/components/ForumDetailHeader";
import { ForumFollowButton } from "@/components/ForumFollowButton";
import { ForumPostCard } from "@/components/ForumPostCard";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { forumAvatarStyle } from "@/lib/avatar-style";
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
  searchParams: Promise<{ pending?: string }>;
}) {
  const { forumId } = await params;
  const { pending } = await searchParams;
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
    <>
      <ForumDetailHeader
        backHref="/home/forums"
        imageUrl={forum.imageUrl}
        accentColor={forum.accentColor}
        title={forum.title}
        newPostHref={joined ? `/home/forums/${forum.id}/new` : undefined}
      />

      <section className="px-5 pb-4 pt-2">
        <div className="flex items-start gap-3">
          <div
            aria-hidden
            className="h-16 w-16 shrink-0 rounded-full bg-cover bg-center"
            style={forumAvatarStyle(forum)}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-sm font-bold uppercase tracking-wide text-brand-purple">
                {forum.title}
              </h1>
              <ForumFollowButton
                forumId={forum.id}
                isFollowing={joined}
                size="md"
              />
            </div>
            <p className="mt-0.5 text-[11px] font-medium text-brand-purple/60">
              {forum._count.members} členov
            </p>
          </div>
        </div>
        {forum.description && (
          <p className="mt-3 text-xs font-semibold leading-relaxed text-brand-purple">
            {forum.description}
          </p>
        )}
      </section>

      {pending === "1" && (
        <div className="mx-5 mb-4 rounded-2xl border border-brand-pink bg-brand-pink-soft/40 p-4 text-center text-sm text-brand-purple">
          Príspevok odoslaný. Čaká na overenie administrátorom — po schválení sa
          zobrazí ostatným.
        </div>
      )}

      {!joined && (
        <div className="mx-5 mb-4 rounded-2xl bg-brand-pink-soft/40 p-4 text-center text-xs text-brand-purple">
          Zapojte sa do fóra, aby ste mohli prispievať do diskusie.
        </div>
      )}

      <div className="flex flex-col gap-4 px-5 pb-24">
        {threads.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center text-sm text-brand-purple/70 shadow-card">
            Zatiaľ žiadne príspevky. {joined ? "Buďte prvý/á!" : ""}
          </div>
        ) : (
          threads.map((thread) => (
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
          ))
        )}
      </div>
    </>
  );
}
