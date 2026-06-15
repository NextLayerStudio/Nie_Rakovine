import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClubProfileForm } from "../ClubProfileForm";
import { deletePostAction } from "@/lib/actions/posts";
import { deleteEventAction } from "@/lib/actions/events";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await prisma.clubProfile.findUnique({
    where: { id },
    include: {
      posts: { orderBy: { createdAt: "desc" } },
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

      <ClubProfileForm mode="edit" profile={profile} />

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="admin-section-title text-sm">Príspevky (obsah)</h2>
          <Link
            href={`/admin/posts/new?profileId=${profile.id}`}
            className="inline-flex items-center gap-1 rounded-pill bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:brightness-110"
          >
            + Príspevok
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {profile.posts.length === 0 && (
            <li className="rounded-xl border border-dashed border-brand-purple/20 p-5 text-center text-sm text-brand-purple/55">
              Žiadne príspevky.
            </li>
          )}
          {profile.posts.map((post) => (
            <li
              key={post.id}
              className="admin-card flex items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <span className="min-w-0">
                <span className="font-semibold text-brand-purple">
                  {post.title}
                </span>
                <span className="ml-2 inline-flex gap-1.5 align-middle">
                  <span className="admin-badge bg-brand-purple/8 text-brand-purple/70">
                    {post.type}
                  </span>
                  <span
                    className={`admin-badge ${
                      post.published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {post.published ? "publikované" : "koncept"}
                  </span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-xs font-semibold text-brand-purple hover:underline"
                >
                  Upraviť
                </Link>
                <form action={deletePostAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="admin-link-danger">
                    Zmazať
                  </button>
                </form>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="admin-section-title text-sm">Podujatia</h2>
          <Link
            href={`/admin/events/new?profileId=${profile.id}`}
            className="inline-flex items-center gap-1 rounded-pill bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:brightness-110"
          >
            + Podujatie
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {profile.events.length === 0 && (
            <li className="rounded-xl border border-dashed border-brand-purple/20 p-5 text-center text-sm text-brand-purple/55">
              Žiadne podujatia.
            </li>
          )}
          {profile.events.map((event) => (
            <li
              key={event.id}
              className="admin-card flex items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <span className="font-semibold text-brand-purple">
                {event.title}
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/admin/events/${event.id}`}
                  className="text-xs font-semibold text-brand-purple hover:underline"
                >
                  Upraviť
                </Link>
                <form action={deleteEventAction}>
                  <input type="hidden" name="id" value={event.id} />
                  <button type="submit" className="admin-link-danger">
                    Zmazať
                  </button>
                </form>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
