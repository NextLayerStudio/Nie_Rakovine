import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCard, PostCard } from "@/components/PostCard";
import { AdminItemActions } from "@/components/admin/AdminItemActions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { deleteEventAction } from "@/lib/actions/events";
import { deletePostAction } from "@/lib/actions/posts";
import { buildPostGallery, postPublicHref } from "@/lib/post-display";
import { prisma } from "@/lib/prisma";
import { ProfileOverviewCard } from "../ProfileOverviewCard";

export const dynamic = "force-dynamic";

type Section = "posts" | "events";

function PublishBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`rounded px-2.5 py-0.5 text-[10px] font-semibold ${
        published
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {published ? "Publikované" : "Koncept"}
    </span>
  );
}

export default async function AdminProfileDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const section: Section = sp.section === "events" ? "events" : "posts";

  // Fetch profile metadata + only the active section's items in parallel
  const [profile, posts, events] = await Promise.all([
    prisma.clubProfile.findUnique({
      where: { id },
      select: {
        id: true,
        displayName: true,
        handle: true,
        bio: true,
        avatarUrl: true,
        published: true,
        cancerTypes: true,
        _count: { select: { posts: true, events: true } },
      },
    }),
    section === "posts"
      ? prisma.post.findMany({
          where: { profileId: id },
          orderBy: { createdAt: "desc" },
          include: { images: { orderBy: { sortOrder: "asc" } } },
        })
      : Promise.resolve(null),
    section === "events"
      ? prisma.event.findMany({
          where: { profileId: id },
          orderBy: { startsAt: "desc" },
        })
      : Promise.resolve(null),
  ]);

  if (!profile) notFound();

  const postCount = profile._count.posts;
  const eventCount = profile._count.events;

  return (
    <div>
      <AdminPageHeader
        title={profile.displayName}
        description={`@${profile.handle}`}
        backHref="/admin/profiles"
        backLabel="Späť na profily"
        actions={
          <Link
            href={`/home/profiles/${profile.handle}`}
            className="admin-btn-outline"
          >
            Náhľad v aplikácii →
          </Link>
        }
      />

      <ProfileOverviewCard profile={profile} />

      {/* Section tabs */}
      <div className="mt-8 flex gap-1 border-b border-brand-purple/10">
        <Link
          href={`/admin/profiles/${id}?section=posts`}
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            section === "posts"
              ? "border-brand-purple text-brand-purple"
              : "border-transparent text-brand-purple/50 hover:text-brand-purple"
          }`}
        >
          Príspevky
          <span className="ml-2 rounded bg-brand-purple/8 px-1.5 py-0.5 text-[11px] font-bold text-brand-purple/60">
            {postCount}
          </span>
        </Link>
        <Link
          href={`/admin/profiles/${id}?section=events`}
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            section === "events"
              ? "border-brand-purple text-brand-purple"
              : "border-transparent text-brand-purple/50 hover:text-brand-purple"
          }`}
        >
          Podujatia
          <span className="ml-2 rounded bg-brand-purple/8 px-1.5 py-0.5 text-[11px] font-bold text-brand-purple/60">
            {eventCount}
          </span>
        </Link>

        <div className="ml-auto flex items-center pb-1">
          {section === "posts" ? (
            <Link
              href={`/admin/posts/new?profileId=${profile.id}`}
              className="rounded bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white hover:brightness-110"
            >
              + Príspevok
            </Link>
          ) : (
            <Link
              href={`/admin/events/new?profileId=${profile.id}`}
              className="rounded bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white hover:brightness-110"
            >
              + Podujatie
            </Link>
          )}
        </div>
      </div>

      {/* Posts */}
      {section === "posts" && (
        <div className="mt-5">
          {!posts || posts.length === 0 ? (
            <div className="rounded-md border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/55">
              Žiadne príspevky.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  href={postPublicHref(post)}
                  type={post.type}
                  title={post.title}
                  excerpt={post.excerpt}
                  imageUrls={buildPostGallery(post.coverUrl, post.images)}
                  compact
                  className="mx-0 mb-0 h-full"
                  statusBadge={<PublishBadge published={post.published} />}
                  footerSlot={
                    <AdminItemActions
                      editHref={`/admin/posts/${post.id}`}
                      deleteAction={deletePostAction}
                      id={post.id}
                      compact
                    />
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Events */}
      {section === "events" && (
        <div className="mt-5">
          {!events || events.length === 0 ? (
            <div className="rounded-md border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/55">
              Žiadne podujatia.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  startsAt={event.startsAt}
                  location={event.location}
                  coverUrl={event.coverUrl}
                  isPaid={event.isPaid}
                  priceCents={event.priceCents}
                  currency={event.currency}
                  compact
                  className="mx-0 mb-0 h-full"
                  statusBadge={<PublishBadge published={event.published} />}
                  footerSlot={
                    <AdminItemActions
                      editHref={`/admin/events/${event.id}`}
                      deleteAction={deleteEventAction}
                      id={event.id}
                      compact
                    />
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
