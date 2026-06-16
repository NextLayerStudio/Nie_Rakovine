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
  const accent = forum.accentColor ?? "#6F2380";

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
      <ForumDetailHeader
        backHref="/home/forums"
        imageUrl={forum.imageUrl}
        accentColor={forum.accentColor}
        title={forum.title}
        newPostHref={joined ? `/home/forums/${forum.id}/new` : undefined}
      />

      <section
        className="mx-5 mt-3 overflow-hidden rounded-3xl border border-brand-purple/[0.06] shadow-card"
        style={{
          background: `linear-gradient(145deg, ${accent}22 0%, ${accent}08 45%, white 100%)`,
        }}
      >
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div
              aria-hidden
              className="h-[72px] w-[72px] shrink-0 rounded-2xl bg-cover bg-center ring-[3px] ring-white shadow-md"
              style={forumAvatarStyle(forum)}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-base font-bold leading-snug text-brand-purple">
                  {forum.title}
                </h1>
                <ForumFollowButton
                  forumId={forum.id}
                  isFollowing={joined}
                  size="md"
                />
              </div>
              <span className="forum-chip mt-2">
                {forum._count.members} členov
              </span>
            </div>
          </div>
          {forum.description && (
            <p className="mt-4 text-sm leading-relaxed text-brand-purple/80">
              {forum.description}
            </p>
          )}
        </div>
      </section>

      {pending === "1" && (
        <div className="forum-banner mx-5 mt-4 text-center">
          Príspevok bol odoslaný a čaká na schválenie administrátorom.
        </div>
      )}

      {!joined && (
        <div className="forum-banner-info mx-5 mt-4 text-center">
          Zapojte sa do fóra, aby ste mohli prispievať do diskusie.
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
    </div>
  );
}
