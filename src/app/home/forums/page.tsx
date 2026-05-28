import Link from "next/link";
import { FeedHeader } from "@/components/FeedHeader";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { joinForumAction } from "@/lib/actions/forums";

export const dynamic = "force-dynamic";

export default async function ForumsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireUser();
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const forums = await prisma.forum.findMany({
    where: {
      published: true,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { members: true, threads: true } },
      members: { where: { userId: user.id }, select: { id: true } },
    },
  });

  return (
    <>
      <FeedHeader name={user.fullName} />

      <section className="px-5 pb-4">
        <form action="/home/forums" method="get" className="relative">
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Hľadať"
            className="w-full rounded-full border-0 bg-brand-pink-soft/70 py-3.5 pl-5 pr-12 text-sm text-brand-purple placeholder-brand-purple/50 outline-none focus:bg-brand-pink-soft"
          />
          <button
            type="submit"
            aria-label="Hľadať"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-purple"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path
                d="M21 21l-4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </form>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 rounded-full bg-brand-pink-soft px-4 py-2 text-xs font-semibold text-brand-purple">
            Filtrovať
          </span>
          <span className="shrink-0 rounded-full bg-brand-pink-soft/60 px-4 py-2 text-xs font-semibold text-brand-purple">
            Akcie
          </span>
          <span className="shrink-0 rounded-full bg-brand-pink px-4 py-2 text-xs font-semibold text-white">
            Články
          </span>
        </div>
      </section>

      <ul className="flex flex-col gap-4 px-5 pb-6">
        {forums.length === 0 && (
          <li className="rounded-3xl bg-white p-6 text-center text-sm text-brand-purple/70 shadow-card">
            Zatiaľ žiadne fóra. Admin môže pridať témy v administrácii.
          </li>
        )}
        {forums.map((forum) => {
          const joined = forum.members.length > 0;
          return (
            <li key={forum.id} className="rounded-3xl bg-white p-4 shadow-card">
              <div className="flex gap-3">
                <div
                  aria-hidden
                  className="h-16 w-16 shrink-0 rounded-full"
                  style={{ backgroundColor: forum.accentColor ?? "#6F2380" }}
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-brand-purple">
                    {forum.title}
                  </h2>
                  <p className="mt-1 text-[11px] text-brand-purple/60">
                    {forum._count.members} členov · {forum._count.threads}{" "}
                    príspevkov
                  </p>
                  {forum.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-brand-purple/80">
                      {forum.description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {joined ? (
                      <Link
                        href={`/home/forums/${forum.id}`}
                        className="rounded-full bg-brand-purple px-4 py-1.5 text-xs font-semibold text-white"
                      >
                        Otvoriť fórum
                      </Link>
                    ) : (
                      <form action={joinForumAction}>
                        <input type="hidden" name="forumId" value={forum.id} />
                        <button
                          type="submit"
                          className="rounded-full bg-brand-pink px-4 py-1.5 text-xs font-semibold text-white"
                        >
                          Zapojiť sa
                        </button>
                      </form>
                    )}
                    {!joined && (
                      <form action={joinForumAction}>
                        <input type="hidden" name="forumId" value={forum.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-brand-pink px-4 py-1.5 text-xs font-semibold text-brand-pink"
                        >
                          Sledovať
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
