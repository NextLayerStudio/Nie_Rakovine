import Link from "next/link";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { ForumFollowButton } from "@/components/ForumFollowButton";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { forumAvatarStyle } from "@/lib/avatar-style";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type Filter = "all" | "following" | "popular";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Všetky" },
  { id: "following", label: "Sledované" },
  { id: "popular", label: "Najviac členov" },
];

export default async function ForumSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; f?: string }>;
}) {
  const user = await requireUser();
  const { q, f } = await searchParams;
  const query = q?.trim() ?? "";
  const filter: Filter =
    f === "following" || f === "popular" ? f : "all";

  const memberships = await prisma.forumMembership.findMany({
    where: { userId: user.id },
    select: { forumId: true },
  });
  const followingIds = new Set(memberships.map((m) => m.forumId));

  const where: Prisma.ForumWhereInput = {
    published: true,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(filter === "following"
      ? { id: { in: [...followingIds] } }
      : {}),
  };

  const forums = await prisma.forum.findMany({
    where,
    orderBy:
      filter === "popular"
        ? { members: { _count: "desc" } }
        : { createdAt: "desc" },
    include: { _count: { select: { members: true } } },
  });

  const buildHref = (next: Filter) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (next !== "all") params.set("f", next);
    const qs = params.toString();
    return qs ? `/home/forums/search?${qs}` : "/home/forums/search";
  };

  return (
    <>
      <FeedHeaderWrapper />

      <section className="px-5 pb-2">
        <form action="/home/forums/search" method="get" className="relative">
          {filter !== "all" && (
            <input type="hidden" name="f" value={filter} />
          )}
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Hľadať"
            autoFocus
            className="w-full rounded-full border-0 bg-brand-pink-soft/60 py-3.5 pl-5 pr-12 text-sm text-brand-purple placeholder-brand-purple/50 outline-none focus:bg-brand-pink-soft"
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

        <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-purple/70">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M4 6h16M7 12h10M10 18h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Filtrovať
          </span>
          {FILTERS.map((opt) => (
            <Link
              key={opt.id}
              href={buildHref(opt.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${
                filter === opt.id
                  ? "bg-brand-pink text-white"
                  : "border border-brand-purple/20 text-brand-purple"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </section>

      {forums.length === 0 ? (
        <div className="mx-5 mt-4 rounded-3xl bg-white p-6 text-center text-sm text-brand-purple/70 shadow-card">
          Nenašli sa žiadne fóra.
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-brand-purple/10 px-5 pt-1">
          {forums.map((forum) => (
            <li key={forum.id} className="flex items-center gap-3 py-3">
              <Link
                href={`/home/forums/${forum.id}`}
                className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center"
                style={forumAvatarStyle(forum)}
                aria-label={forum.title}
              />
              <Link href={`/home/forums/${forum.id}`} className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold uppercase tracking-wide text-brand-purple">
                  {forum.title}
                </h2>
                <p className="text-[11px] text-brand-purple/55">
                  {forum._count.members} členov
                </p>
              </Link>
              <ForumFollowButton
                forumId={forum.id}
                isFollowing={followingIds.has(forum.id)}
                size="md"
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
