import Link from "next/link";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { ForumFollowButton } from "@/components/ForumFollowButton";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { forumAvatarStyle } from "@/lib/avatar-style";

export const dynamic = "force-dynamic";

export default async function ForumsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const user = await requireUser();
  const { submitted } = await searchParams;

  const [forums, pendingForums, memberships] = await Promise.all([
    prisma.forum.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { members: true } } },
    }),
    prisma.forum.findMany({
      where: { published: false, createdById: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.forumMembership.findMany({
      where: { userId: user.id },
      select: { forumId: true },
    }),
  ]);
  const followingIds = new Set(memberships.map((m) => m.forumId));

  return (
    <>
      <FeedHeaderWrapper />

      <section className="px-5 pb-3">
        <Link
          href="/home/forums/search"
          className="flex w-full items-center justify-between rounded-full bg-brand-pink-soft/60 py-3.5 pl-5 pr-4 text-sm text-brand-purple/60"
        >
          <span>Hľadať</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M21 21l-4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </section>

      {submitted === "1" && (
        <div className="mx-5 mb-4 rounded-2xl border border-brand-pink bg-brand-pink-soft/40 p-4 text-center text-sm text-brand-purple">
          Fórum bolo odoslané na schválenie. Zobrazí sa ostatným až po
          schválení administrátorom.
        </div>
      )}

      {pendingForums.length > 0 && (
        <section className="px-5 pb-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-purple/60">
            Čaká na schválenie
          </h2>
          <ul className="flex flex-col gap-3">
            {pendingForums.map((forum) => (
              <li
                key={forum.id}
                className="flex items-center gap-3 rounded-3xl border border-dashed border-brand-pink/50 bg-white/80 p-4"
              >
                <div
                  aria-hidden
                  className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center opacity-80"
                  style={forumAvatarStyle(forum)}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold uppercase tracking-wide text-brand-purple">
                    {forum.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-medium text-brand-pink">
                    Čaká na schválenie administrátorom
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {forums.length === 0 ? (
        <div className="mx-5 mt-2 rounded-3xl bg-white p-6 text-center text-sm text-brand-purple/70 shadow-card">
          Zatiaľ žiadne schválené fóra. Vytvorte prvé!
        </div>
      ) : (
        <ul className="flex flex-col gap-4 px-5 pb-6">
          {forums.map((forum) => (
            <li
              key={forum.id}
              className="rounded-3xl bg-white p-4 shadow-card"
            >
              <div className="flex items-start gap-3">
                <Link
                  href={`/home/forums/${forum.id}`}
                  className="h-16 w-16 shrink-0 rounded-full bg-cover bg-center"
                  style={forumAvatarStyle(forum)}
                  aria-label={forum.title}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/home/forums/${forum.id}`} className="min-w-0">
                      <h2 className="truncate text-sm font-bold uppercase tracking-wide text-brand-purple">
                        {forum.title}
                      </h2>
                    </Link>
                    <ForumFollowButton
                      forumId={forum.id}
                      isFollowing={followingIds.has(forum.id)}
                      size="md"
                      joinLabel="Zapojiť sa"
                      joinedLabel="Zapojené"
                    />
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-brand-purple/60">
                    {forum._count.members} členov
                  </p>
                </div>
              </div>
              {forum.description && (
                <p className="mt-3 text-xs leading-relaxed text-brand-purple/80">
                  {forum.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="px-5 pb-8">
        <Link
          href="/home/forums/new"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-brand-pink py-3 text-sm font-semibold text-brand-pink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Vytvoriť fórum
        </Link>
      </div>
    </>
  );
}
