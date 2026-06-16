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
    <div className="forum-page min-h-full">
      <FeedHeaderWrapper />

      <section className="px-5 pb-1 pt-1">
        <h2 className="text-lg font-bold text-brand-purple">Fóra</h2>
        <p className="mt-0.5 text-xs text-brand-purple/55">
          Diskusie, podpora a zdieľanie skúseností
        </p>
      </section>

      <section className="px-5 pb-4 pt-3">
        <Link href="/home/forums/search" className="forum-search flex items-center justify-between">
          <span className="text-brand-purple/45">Hľadať fóra…</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand-purple/50" fill="none" aria-hidden>
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
        <div className="forum-banner mx-5 mb-4 text-center">
          Fórum bolo odoslané na schválenie. Zobrazí sa ostatným až po
          schválení administrátorom.
        </div>
      )}

      {pendingForums.length > 0 && (
        <section className="px-5 pb-4">
          <h3 className="forum-section-label mb-3">Čaká na schválenie</h3>
          <ul className="flex flex-col gap-3">
            {pendingForums.map((forum) => (
              <li
                key={forum.id}
                className="flex items-center gap-3 rounded-3xl border border-dashed border-amber-300/60 bg-amber-50/50 p-4"
              >
                <div
                  aria-hidden
                  className="h-14 w-14 shrink-0 rounded-2xl bg-cover bg-center opacity-90 ring-2 ring-white"
                  style={forumAvatarStyle(forum)}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-brand-purple">
                    {forum.title}
                  </h3>
                  <p className="mt-1 text-[11px] font-medium text-amber-700">
                    Čaká na schválenie administrátorom
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {forums.length === 0 ? (
        <div className="forum-empty mx-5 mt-2">
          Zatiaľ žiadne schválené fóra. Vytvorte prvé!
        </div>
      ) : (
        <>
          <h3 className="forum-section-label mb-3 px-5">
            {followingIds.size > 0 ? "Všetky fóra" : "Objavte fóra"}
          </h3>
          <ul className="flex flex-col gap-3 px-5 pb-4">
            {forums.map((forum) => (
              <li key={forum.id} className="forum-card p-4">
                <div className="flex items-start gap-4">
                  <Link
                    href={`/home/forums/${forum.id}`}
                    className="shrink-0"
                    aria-label={forum.title}
                  >
                    <div
                      aria-hidden
                      className="h-[68px] w-[68px] rounded-2xl bg-cover bg-center ring-2 ring-white shadow-sm"
                      style={{
                        ...forumAvatarStyle(forum),
                        boxShadow: `0 4px 16px ${forum.accentColor ?? "#6F2380"}28`,
                      }}
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/home/forums/${forum.id}`} className="min-w-0">
                        <h2 className="truncate text-[15px] font-bold leading-snug text-brand-purple">
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
                    <span className="forum-chip mt-2">
                      <MembersIcon />
                      {forum._count.members} členov
                    </span>
                  </div>
                </div>
                {forum.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-brand-purple/70">
                    {forum.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="px-5 pb-8 pt-1">
        <Link href="/home/forums/new" className="forum-btn-outline">
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
    </div>
  );
}

function MembersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
      <path
        d="M16 19a4 4 0 00-8 0M12 12a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
