import { notFound } from "next/navigation";
import { ForumSubHeader } from "@/components/ForumSubHeader";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { CommentForm } from "./CommentForm";

export const dynamic = "force-dynamic";

export default async function ForumThreadPage({
  params,
}: {
  params: Promise<{ forumId: string; threadId: string }>;
}) {
  const { forumId, threadId } = await params;
  await requireUser();

  const thread = await prisma.forumThread.findUnique({
    where: { id: threadId, forumId },
    include: {
      author: { select: { fullName: true } },
      forum: { select: { title: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { fullName: true } } },
      },
    },
  });

  if (!thread) notFound();

  const cover = thread.coverUrl
    ? { backgroundImage: `url(${thread.coverUrl})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
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
            <p className="mt-3 text-sm leading-relaxed text-brand-purple/90 whitespace-pre-wrap">
              {thread.body}
            </p>
            <div className="mt-4 flex items-center gap-5 border-t border-brand-purple/10 pt-3 text-brand-purple/70">
              <span className="flex items-center gap-1.5 text-xs">
                <HeartIcon /> {thread.likeCount}
              </span>
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
              <p className="text-xs font-semibold text-brand-purple">
                {c.author.fullName}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-purple/90 whitespace-pre-wrap">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      </article>

      <CommentForm forumId={forumId} threadId={threadId} />
    </>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M12 21s-7-4-7-10a4.5 4.5 0 019-2.2A4.5 4.5 0 0119 11c0 6-7 10-7 10z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
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
