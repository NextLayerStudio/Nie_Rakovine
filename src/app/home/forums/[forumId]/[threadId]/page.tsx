import { notFound } from "next/navigation";
import { ForumSubHeader } from "@/components/ForumSubHeader";
import { ForumThreadChat } from "@/components/ForumThreadChat";
import { ForumThreadLikeButton } from "@/components/ForumThreadLikeButton";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
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
          include: {
            author: { select: { fullName: true, profile: { select: { avatarUrl: true } } } },
            likes: {
              where: { userId: user.id },
              select: { id: true },
              take: 1,
            },
            replyTo: {
              select: {
                body: true,
                author: { select: { fullName: true } },
              },
            },
          },
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
  const canComment = !!membership && !isPending;

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

  const chatMessages = thread.comments.map((c) => ({
    id: c.id,
    authorName: c.author.fullName,
    avatarUrl: c.author.profile?.avatarUrl ?? null,
    body: c.body,
    pendingModeration: c.status !== APPROVED,
    liked: c.likes.length > 0,
    likeCount: c.likeCount ?? 0,
    replyTo: c.replyTo
      ? {
          authorName: c.replyTo.author.fullName,
          body: c.replyTo.body,
        }
      : null,
  }));

  return (
    <div className="forum-page min-h-full">
      <ForumSubHeader
        backHref={`/home/forums/${forumId}`}
        title={thread.forum.title}
      />

      {isPending && (
        <div className="forum-banner mx-5 mt-3 text-center text-xs">
          Táto správa čaká na overenie. Vidíte ju len vy, kým ju admin
          neschváli.
        </div>
      )}

      <article className="px-5 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-3">
        <div className="forum-card overflow-hidden">
          <div className="aspect-[4/3] w-full" style={cover} />
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-pink to-brand-purple text-xs font-bold text-white"
              >
                {initials(thread.author.fullName)}
              </div>
              <p className="text-sm font-semibold text-brand-purple">
                {thread.author.fullName}
              </p>
            </div>
            {thread.title && (
              <h1 className="mt-3 text-lg font-bold leading-snug text-brand-purple">
                {thread.title}
              </h1>
            )}
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-brand-purple/85">
              {thread.body}
            </p>
            <div className="mt-5 flex items-center gap-4 border-t border-brand-purple/[0.06] pt-4">
              <ForumThreadLikeButton
                threadId={thread.id}
                forumId={forumId}
                liked={!!userLike}
                count={thread.likeCount}
              />
              <span className="forum-chip">
                <CommentIcon /> {thread.comments.length} v chate
              </span>
            </div>
          </div>
        </div>

        <ForumThreadChat
          forumId={forumId}
          threadId={threadId}
          canComment={canComment}
          comments={chatMessages}
          currentUserName={user.fullName}
          currentAvatarUrl={user.profile?.avatarUrl ?? null}
        />
      </article>

      {!canComment && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-purple/10 bg-white/95 px-5 py-4 text-center text-xs text-brand-purple/70 backdrop-blur-md"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {isPending
            ? "Chat bude dostupný po schválení príspevku administrátorom."
            : "Zapojte sa do fóra, aby ste mohli písať komentáre."}
        </div>
      )}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M4 12a7 7 0 0112-4.95A7 7 0 0118 20H9l-4 3 1-4A7 7 0 014 12z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
