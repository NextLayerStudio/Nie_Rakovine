import Link from "next/link";
import { notFound } from "next/navigation";
import { ForumSubHeader } from "@/components/ForumSubHeader";
import { ForumThreadLikeButton } from "@/components/ForumThreadLikeButton";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { joinForumAction } from "@/lib/actions/forums";
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

  const threads = await prisma.forumThread.findMany({
    where: { forumId, ...visibleThreadsWhere(user.id) },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { fullName: true } },
      _count: { select: { comments: approvedCommentsCountWhere() } },
    },
  });

  const joined = forum.members.length > 0;

  const userLikes = await prisma.forumThreadLike.findMany({
    where: {
      userId: user.id,
      threadId: { in: threads.map((t) => t.id) },
    },
    select: { threadId: true },
  });
  const likedThreadIds = new Set(userLikes.map((l) => l.threadId));

  return (
    <>
      <ForumSubHeader backHref="/home/forums" title={forum.title} />

      {pending === "1" && (
        <div className="mx-5 mb-4 rounded-2xl border border-brand-pink bg-brand-pink-soft/40 p-4 text-center text-sm text-brand-purple">
          Správa odoslaná. Čaká na overenie administrátorom — po schválení sa
          zobrazí ostatným.
        </div>
      )}

      {!joined && (
        <div className="mx-5 mb-4 rounded-2xl bg-brand-pink-soft/50 p-4 text-center">
          <p className="text-xs text-brand-purple">
            Zapojte sa do fóra, aby ste mohli čítať a písať správy.
          </p>
          <form action={joinForumAction} className="mt-3">
            <input type="hidden" name="forumId" value={forum.id} />
            <button
              type="submit"
              className="rounded-full bg-brand-pink px-6 py-2 text-sm font-semibold text-white"
            >
              Zapojiť sa
            </button>
          </form>
        </div>
      )}

      <ul className="flex flex-col gap-4 px-5 pb-24">
        {joined &&
          threads.map((thread) => {
            const isPending = thread.status !== APPROVED;
            return (
              <li
                key={thread.id}
                className="overflow-hidden rounded-3xl bg-white shadow-card"
              >
                <Link
                  href={`/home/forums/${forum.id}/${thread.id}`}
                  className="block"
                >
                  {thread.coverUrl ? (
                    <div
                      className="aspect-[4/3] w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${thread.coverUrl})` }}
                    />
                  ) : (
                    <div
                      className="aspect-[4/3] w-full"
                      style={{
                        background:
                          "linear-gradient(135deg, #f5e0c8 0%, #d8a079 50%, #6f2380 100%)",
                      }}
                    />
                  )}
                  <div className="p-4 pb-2">
                    {isPending && (
                      <span className="mb-2 inline-block rounded-pill bg-brand-pink-soft px-2 py-0.5 text-[10px] font-semibold text-brand-purple">
                        Čaká na overenie
                      </span>
                    )}
                    <p className="text-xs font-semibold text-brand-purple">
                      {thread.author.fullName}
                    </p>
                    {thread.title && (
                      <h3 className="mt-1 text-sm font-bold text-brand-purple">
                        {thread.title}
                      </h3>
                    )}
                    <p className="mt-2 line-clamp-3 text-xs text-brand-purple/80">
                      {thread.body}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-4 px-4 pb-4 text-brand-purple/70">
                  <ForumThreadLikeButton
                    threadId={thread.id}
                    forumId={forum.id}
                    liked={likedThreadIds.has(thread.id)}
                    count={thread.likeCount}
                  />
                  <Link
                    href={`/home/forums/${forum.id}/${thread.id}`}
                    className="flex items-center gap-1 text-xs"
                  >
                    <CommentIcon /> {thread._count.comments}
                  </Link>
                </div>
              </li>
            );
          })}

        {joined && threads.length === 0 && (
          <li className="rounded-3xl bg-white p-6 text-center text-sm text-brand-purple/70 shadow-card">
            Zatiaľ žiadne schválené správy. Buďte prvý/á!
          </li>
        )}
      </ul>

      {joined && (
        <div className="fixed bottom-[88px] left-0 right-0 z-10 flex justify-center px-5">
          <Link
            href={`/home/forums/${forum.id}/new`}
            className="w-full max-w-[340px] rounded-full bg-brand-pink py-3 text-center text-sm font-semibold text-white shadow-soft"
          >
            Nová správa
          </Link>
        </div>
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
