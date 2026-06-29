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
import { safeReturnHref } from "@/lib/post-display";

export const dynamic = "force-dynamic";

export default async function ForumThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ forumId: string; threadId: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { forumId, threadId } = await params;
  const { from } = await searchParams;
  const backHref = safeReturnHref(from, `/home/forums/${forumId}`);
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

  const coverStyle = thread.coverUrl
    ? {
        backgroundImage: `url(${thread.coverUrl})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : undefined;

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
        backHref={backHref}
        title={thread.forum.title}
      />

      {isPending && (
        <div className="forum-banner mx-5 mt-3 text-center text-xs">
          Táto správa čaká na overenie. Vidíte ju len vy, kým ju admin
          neschváli.
        </div>
      )}

      <article className="pb-[calc(7.5rem+env(safe-area-inset-bottom))]">
        <section className="border-b border-brand-purple/8 px-5 pb-5 pt-3">
          {thread.coverUrl && coverStyle && (
            <div
              className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-cover bg-center"
              style={coverStyle}
              role="img"
              aria-label={thread.title ?? "Obrázok príspevku"}
            />
          )}

          <div className="flex gap-3">
            <div
              aria-hidden
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-pink to-brand-purple text-[10px] font-bold text-white"
            >
              {initials(thread.author.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-purple/60">
                {thread.author.fullName}
              </p>
              {thread.title && (
                <h1 className="mt-1 text-lg font-bold leading-snug text-brand-purple">
                  {thread.title}
                </h1>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-brand-purple/85">
                {thread.body}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-5">
            <ForumThreadLikeButton
              threadId={thread.id}
              forumId={forumId}
              liked={!!userLike}
              count={thread.likeCount}
              iconSize="md"
            />
            <span className="flex items-center gap-1.5 text-brand-purple/60">
              <CommentIcon />
              {thread.comments.length > 0 && (
                <span className="text-sm font-semibold">
                  {thread.comments.length}
                </span>
              )}
            </span>
          </div>
        </section>

        <div className="px-5">
          <ForumThreadChat
            forumId={forumId}
            threadId={threadId}
            canComment={canComment}
            comments={chatMessages}
            currentUserName={user.fullName}
            currentAvatarUrl={user.profile?.avatarUrl ?? null}
          />
        </div>
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
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
