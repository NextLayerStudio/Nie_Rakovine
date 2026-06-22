import Link from "next/link";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { ForumFollowButton } from "@/components/ForumFollowButton";
import { ForumSearchBar } from "@/components/forums/ForumSearchBar";
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
    <div className="forum-page min-h-full">
      <FeedHeaderWrapper />

      <section className="px-5 pb-2 pt-1">
        <h2 className="text-lg font-bold text-brand-purple">Hľadať fóra</h2>
      </section>

      <section className="px-5 pb-2">
        <ForumSearchBar defaultQuery={query} filter={filter} autoFocus />

        <div className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="forum-section-label shrink-0">Filter</span>
          {FILTERS.map((opt) => (
            <Link
              key={opt.id}
              href={buildHref(opt.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                filter === opt.id
                  ? "bg-brand-purple text-white shadow-soft"
                  : "border border-brand-purple/15 bg-white text-brand-purple hover:border-brand-purple/30"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </section>

      {forums.length === 0 ? (
        <div className="forum-empty mx-5 mt-4">Nenašli sa žiadne fóra.</div>
      ) : (
        <ul className="flex flex-col gap-3 px-5 pb-6 pt-2">
          {forums.map((forum) => (
            <li key={forum.id} className="forum-card flex items-center gap-3 p-3">
              <Link
                href={`/home/forums/${forum.id}`}
                className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-cover bg-center ring-2 ring-white"
                style={forumAvatarStyle(forum)}
                aria-label={forum.title}
              />
              <Link href={`/home/forums/${forum.id}`} className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold text-brand-purple">
                  {forum.title}
                </h2>
                <span className="forum-chip mt-1">
                  {forum._count.members} členov
                </span>
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
    </div>
  );
}
