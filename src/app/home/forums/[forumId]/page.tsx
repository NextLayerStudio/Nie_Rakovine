import Link from "next/link";
import { notFound } from "next/navigation";
import { ForumSubHeader } from "@/components/ForumSubHeader";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { joinForumAction } from "@/lib/actions/forums";

export const dynamic = "force-dynamic";

export default async function ForumDetailPage({
  params,
}: {
  params: Promise<{ forumId: string }>;
}) {
  const { forumId } = await params;
  const user = await requireUser();

  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
    include: {
      members: { where: { userId: user.id } },
      threads: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { fullName: true } },
          _count: { select: { comments: true } },
        },
      },
      _count: { select: { members: true } },
    },
  });

  if (!forum || !forum.published) notFound();

  const joined = forum.members.length > 0;

  return (
    <>
      <ForumSubHeader backHref="/home/forums" title={forum.title} showPlus />

      {!joined && (
        <div className="mx-5 mb-4 rounded-2xl bg-brand-pink-soft/50 p-4 text-center">
          <p className="text-xs text-brand-purple">
            Zapojte sa do fóra, aby ste mohli čítať a písať príspevky.
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
          forum.threads.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`/home/forums/${forum.id}/${thread.id}`}
                className="block overflow-hidden rounded-3xl bg-white shadow-card"
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
                <div className="p-4">
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
                  <div className="mt-3 flex items-center gap-4 text-brand-purple/70">
                    <span className="flex items-center gap-1 text-xs">
                      <HeartIcon /> {thread.likeCount}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <CommentIcon /> {thread._count.comments}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}

        {joined && forum.threads.length === 0 && (
          <li className="rounded-3xl bg-white p-6 text-center text-sm text-brand-purple/70 shadow-card">
            Zatiaľ žiadne príspevky. Buďte prvý/á!
          </li>
        )}
      </ul>

      {joined && (
        <div className="fixed bottom-[88px] left-0 right-0 z-10 flex justify-center px-5">
          <Link
            href={`/home/forums/${forum.id}/new`}
            className="w-full max-w-[340px] rounded-full bg-brand-pink py-3 text-center text-sm font-semibold text-white shadow-soft"
          >
            Nový príspevok
          </Link>
        </div>
      )}
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
