import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClubProfileForm } from "../ClubProfileForm";
import { deletePostAction } from "@/lib/actions/posts";
import { deleteEventAction } from "@/lib/actions/events";

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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{profile.displayName}</h1>
        <Link
          href={`/home/profiles/${profile.handle}`}
          className="text-sm text-brand-purple underline-offset-2 hover:underline"
        >
          Náhľad v aplikácii →
        </Link>
      </div>

      <ClubProfileForm mode="edit" profile={profile} />

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Príspevky (obsah)</h2>
          <Link
            href={`/admin/posts/new?profileId=${profile.id}`}
            className="rounded-pill bg-brand-purple px-3 py-1.5 text-xs font-semibold text-white"
          >
            + Príspevok
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {profile.posts.length === 0 && (
            <li className="text-sm text-brand-purple/60">Žiadne príspevky.</li>
          )}
          {profile.posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between rounded-xl border border-brand-purple/10 px-4 py-3 text-sm"
            >
              <span>
                <span className="font-medium">{post.title}</span>
                <span className="ml-2 text-xs text-brand-purple/60">
                  {post.type}
                  {post.published ? " · publikované" : " · koncept"}
                </span>
              </span>
              <span className="flex gap-2">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-xs text-brand-purple hover:underline"
                >
                  Upraviť
                </Link>
                <form action={deletePostAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline"
                  >
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
          <h2 className="text-lg font-bold">Podujatia</h2>
          <Link
            href={`/admin/events/new?profileId=${profile.id}`}
            className="rounded-pill bg-brand-purple px-3 py-1.5 text-xs font-semibold text-white"
          >
            + Podujatie
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {profile.events.length === 0 && (
            <li className="text-sm text-brand-purple/60">Žiadne podujatia.</li>
          )}
          {profile.events.map((event) => (
            <li
              key={event.id}
              className="flex items-center justify-between rounded-xl border border-brand-purple/10 px-4 py-3 text-sm"
            >
              <span className="font-medium">{event.title}</span>
              <span className="flex gap-2">
                <Link
                  href={`/admin/events/${event.id}`}
                  className="text-xs text-brand-purple hover:underline"
                >
                  Upraviť
                </Link>
                <form action={deleteEventAction}>
                  <input type="hidden" name="id" value={event.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline"
                  >
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
