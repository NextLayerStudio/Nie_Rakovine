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

function PublishBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`rounded-pill px-2.5 py-0.5 text-[10px] font-semibold ${
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
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await prisma.clubProfile.findUnique({
    where: { id },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      },
      events: { orderBy: { startsAt: "desc" } },
    },
  });
  if (!profile) notFound();

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

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="admin-section-title text-sm">Príspevky</h2>
          <Link
            href={`/admin/posts/new?profileId=${profile.id}`}
            className="inline-flex items-center gap-1 rounded-pill bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:brightness-110"
          >
            + Príspevok
          </Link>
        </div>

        {profile.posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/55">
            Žiadne príspevky.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profile.posts.map((post) => (
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
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="admin-section-title text-sm">Podujatia</h2>
          <Link
            href={`/admin/events/new?profileId=${profile.id}`}
            className="inline-flex items-center gap-1 rounded-pill bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:brightness-110"
          >
            + Podujatie
          </Link>
        </div>

        {profile.events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/55">
            Žiadne podujatia.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profile.events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                startsAt={event.startsAt}
                location={event.location}
                coverUrl={event.coverUrl}
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
      </section>
    </div>
  );
}
