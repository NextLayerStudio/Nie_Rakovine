import Link from "next/link";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { ForumFeedHeader } from "@/components/ForumFeedHeader";
import { ForumFollowButton } from "@/components/ForumFollowButton";
import { ForumThreadLikeButton } from "@/components/ForumThreadLikeButton";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { forumAvatarStyle } from "@/lib/avatar-style";
import { APPROVED, approvedCommentsCountWhere } from "@/lib/forum-moderation";
import { relevantWhere } from "@/lib/cancer-personalization";
import type { CancerType } from "@prisma/client";

export const dynamic = "force-dynamic";

type Tab = "prispevky" | "profily";

export default async function ForumsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string }>;
}) {
  const user = await requireUser();
  const { q, tab } = await searchParams;
  const query = q?.trim() ?? "";
  const activeTab: Tab = tab === "profily" ? "profily" : "prispevky";

  const memberships = await prisma.forumMembership.findMany({
    where: { userId: user.id },
    select: { forumId: true },
  });
  const followingIds = new Set(memberships.map((m) => m.forumId));
  const userTypes = user.profile?.cancerTypes ?? [];

  return (
    <>
      <FeedHeaderWrapper />

      <section className="px-5 pb-2">
        <form action="/home/forums" method="get" className="relative">
          <input type="hidden" name="tab" value={activeTab} />
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
          <TabPill
            label="Príspevky"
            href={query ? `/home/forums?q=${encodeURIComponent(query)}` : "/home/forums"}
            active={activeTab === "prispevky"}
          />
          <TabPill
            label="Profily"
            href={
              query
                ? `/home/forums?tab=profily&q=${encodeURIComponent(query)}`
                : "/home/forums?tab=profily"
            }
            active={activeTab === "profily"}
          />
        </div>
      </section>

      {activeTab === "prispevky" ? (
        <ThreadFeed
          query={query}
          followingIds={followingIds}
          userId={user.id}
          userTypes={userTypes}
        />
      ) : (
        <ProfilesList
          query={query}
          followingIds={followingIds}
          userTypes={userTypes}
        />
      )}
    </>
  );
}

function TabPill({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
        active
          ? "bg-brand-pink text-white"
          : "bg-brand-pink-soft/60 text-brand-purple"
      }`}
    >
      {label}
    </Link>
  );
}

/* ------------------------- Príspevky (feed) ------------------------- */

async function ThreadFeed({
  query,
  followingIds,
  userId,
  userTypes,
}: {
  query: string;
  followingIds: Set<string>;
  userId: string;
  userTypes: CancerType[];
}) {
  const threads = await prisma.forumThread.findMany({
    where: {
      status: APPROVED,
      forum: { published: true, ...relevantWhere(userTypes) },
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { body: { contains: query, mode: "insensitive" } },
              { forum: { title: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 40,
    include: {
      author: { select: { fullName: true } },
      forum: {
        select: { id: true, title: true, imageUrl: true, accentColor: true },
      },
      _count: { select: { comments: approvedCommentsCountWhere() } },
    },
  });

  const userLikes = await prisma.forumThreadLike.findMany({
    where: {
      userId,
      threadId: { in: threads.map((t) => t.id) },
    },
    select: { threadId: true },
  });
  const likedThreadIds = new Set(userLikes.map((l) => l.threadId));

  if (threads.length === 0) {
    return (
      <div className="mx-5 mt-4 rounded-3xl bg-white p-6 text-center text-sm text-brand-purple/70 shadow-card">
        Zatiaľ žiadne príspevky vo fórach.
      </div>
    );
  }

  return (
    <section className="pt-1">
      {threads.map((thread) => (
        <div key={thread.id}>
          <ForumFeedHeader
            forumId={thread.forum.id}
            title={thread.forum.title}
            imageUrl={thread.forum.imageUrl}
            accentColor={thread.forum.accentColor}
            isFollowing={followingIds.has(thread.forum.id)}
          />
          <div className="mx-4 mb-5 mt-2 overflow-hidden rounded-3xl bg-white shadow-card">
            <Link
              href={`/home/forums/${thread.forum.id}/${thread.id}`}
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
                <p className="text-xs font-semibold text-brand-purple">
                  {thread.author.fullName}
                </p>
                {thread.title && (
                  <h3 className="mt-1 text-sm font-bold text-brand-purple">
                    {thread.title}
                  </h3>
                )}
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-brand-purple/80">
                  {thread.body}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-4 px-4 pb-4 text-brand-purple/70">
              <ForumThreadLikeButton
                threadId={thread.id}
                forumId={thread.forum.id}
                liked={likedThreadIds.has(thread.id)}
                count={thread.likeCount}
              />
              <Link
                href={`/home/forums/${thread.forum.id}/${thread.id}`}
                className="flex items-center gap-1 text-xs"
              >
                <CommentIcon /> {thread._count.comments}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ------------------------- Profily (forums) ------------------------- */

async function ProfilesList({
  query,
  followingIds,
  userTypes,
}: {
  query: string;
  followingIds: Set<string>;
  userTypes: CancerType[];
}) {
  const forums = await prisma.forum.findMany({
    where: {
      published: true,
      AND: [
        relevantWhere(userTypes),
        query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { members: true, threads: true } },
    },
  });

  if (forums.length === 0) {
    return (
      <div className="mx-5 mt-4 rounded-3xl bg-white p-6 text-center text-sm text-brand-purple/70 shadow-card">
        Zatiaľ žiadne fóra.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 px-5 pb-6 pt-1">
      {forums.map((forum) => {
        const following = followingIds.has(forum.id);
        return (
          <li
            key={forum.id}
            className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card"
          >
            <Link
              href={`/home/forums/${forum.id}`}
              className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center"
              style={forumAvatarStyle(forum)}
              aria-label={forum.title}
            />
            <div className="min-w-0 flex-1">
              <Link href={`/home/forums/${forum.id}`}>
                <h2 className="truncate text-sm font-bold uppercase tracking-wide text-brand-purple">
                  {forum.title}
                </h2>
              </Link>
              <p className="mt-0.5 text-[11px] text-brand-purple/60">
                {forum._count.members} členov · {forum._count.threads}{" "}
                príspevkov
              </p>
            </div>
            <ForumFollowButton
              forumId={forum.id}
              isFollowing={following}
              size="md"
            />
          </li>
        );
      })}
    </ul>
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
