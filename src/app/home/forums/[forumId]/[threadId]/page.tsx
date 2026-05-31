import { notFound } from "next/navigation";
import { ForumSubHeader } from "@/components/ForumSubHeader";
import { ForumThreadLikeButton } from "@/components/ForumThreadLikeButton";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { CommentForm } from "./CommentForm";
import {
  APPROVED,
  visibleCommentsWhere,
  visibleThreadsWhere,
} from "@/lib/forum-moderation";

export const dynamic = "force-dynamic";

export default async function ForumThreadPage({
  params,
}: {
  params: Promise<{ forumId: string; threadId: string }>;
}) {
  const { forumId, threadId } = await params;
  const user = await requireUser();

  const [thread, membership, userLike] = await Promise.all([
    prisma.forumThread.findFirst({
      where: {
        id: threadId,
        forumId,
        ...visibleThreadsWhere(user.id),
        NOT: { status: "REJECTED" },
      },
      include: {
        author: { select: { fullName: true } },
        forum: { select: { title: true } },
        comments: {
          where: visibleCommentsWhere(user.id),
          orderBy: { createdAt: "asc" },
          include: { author: { select: { fullName: true } } },
        },
      },
    }),
    prisma.forumMembership.findUnique({
      where: { forumId_userId: { forumId, userId: user.id } },
    }),
    prisma.forumThreadLike.findUnique({
      where: { userId_threadId: { userId: user.id, threadId } },
    }),
  ]);

  if (!thread) notFound();

  const isPending = thread.status !== APPROVED;
  const canComment = !!membership;

  const cover = thread.coverUrl
    ? {
        backgroundImage: `url(${thread.coverUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : {
        background:
          "linear-gradient(135deg, #f5e0c8 0%, #d8a079 50%, #6f2380 100%)",
      };

  return (
    <>
      <ForumSubHeader
        backHref={`/home/forums/${forumId}`}
        title={thread.forum.title}
      />

      {isPending && (
        <div className="mx-5 mb-4 rounded-2xl border border-brand-pink bg-brand-pink-soft/40 p-3 text-center text-xs text-brand-purple">
          Táto správa čaká na overenie. Vidíte ju len vy, kým ju admin
          neschváli.
        </div>
      )}

      <article className="px-5 pb-32">
        <div className="overflow-hidden rounded-3xl bg-white shadow-card">
          <div className="aspect-[4/3] w-full" style={cover} />
          <div className="p-4">
            <p className="text-sm font-semibold text-brand-purple">
              {thread.author.fullName}
            </p>
            {thread.title && (
              <h1 className="mt-1 text-base font-bold text-brand-purple">
                {thread.title}
              </h1>
            )}
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-brand-purple/90">
              {thread.body}
            </p>
            <div className="mt-4 flex items-center gap-5 border-t border-brand-purple/10 pt-3 text-brand-purple/70">
              <ForumThreadLikeButton
                threadId={thread.id}
                forumId={forumId}
                liked={!!userLike}
                count={thread.likeCount}
                variant="pill"
              />
              <span className="flex items-center gap-1.5 text-xs">
                <CommentIcon /> {thread.comments.length}
              </span>
            </div>
          </div>
        </div>

        <ul className="mt-6 space-y-4">
          {thread.comments.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl bg-brand-pink-soft/40 p-4"
            >
              {c.status !== APPROVED && (
                <span className="mb-2 inline-block text-[10px] font-semibold text-brand-pink">
                  Čaká na overenie
                </span>
              )}
              <p className="text-xs font-semibold text-brand-purple">
                {c.author.fullName}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-brand-purple/90">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      </article>

      {canComment && (
        <CommentForm forumId={forumId} threadId={threadId} />
      )}
    </>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 12a7 7 0 0112-4.95A7 7 0 0118 20H9l-4 3 1-4A7 7 0 014 12z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
