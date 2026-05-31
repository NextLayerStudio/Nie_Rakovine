import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteClubProfileAction } from "@/lib/actions/admin-profiles";
import { profileAvatarStyle } from "@/lib/avatar-style";

export const dynamic = "force-dynamic";

export default async function AdminProfilesPage() {
  const profiles = await prisma.clubProfile.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { posts: true, events: true } },
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Profily</h1>
          <p className="mt-1 text-sm text-brand-purple/70">
            Instagram štýl — admin spravuje profil, príspevky a podujatia.
            Používatelia profily len prezerajú.
          </p>
        </div>
        <Link
          href="/admin/profiles/new"
          className="rounded-pill bg-brand-purple px-4 py-2 text-sm font-semibold text-white"
        >
          + Nový profil
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {profiles.length === 0 && (
          <p className="col-span-2 rounded-2xl border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/60">
            Zatiaľ žiadne profily. Vytvorte prvý profil.
          </p>
        )}
        {profiles.map((p) => (
          <article
            key={p.id}
            className="flex gap-4 rounded-2xl border border-brand-purple/10 bg-white p-4 shadow-card"
          >
            <div
              className="h-16 w-16 shrink-0 rounded-full bg-cover bg-center"
              style={profileAvatarStyle(p.avatarUrl)}
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-bold">{p.displayName}</h2>
              <p className="text-xs text-brand-purple/60">@{p.handle}</p>
              <p className="mt-1 text-xs text-brand-purple/70">
                {p._count.posts} príspevkov · {p._count.events} podujatí
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/admin/profiles/${p.id}`}
                  className="text-xs font-semibold text-brand-purple hover:underline"
                >
                  Spravovať
                </Link>
                <form action={deleteClubProfileAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline"
                  >
                    Zmazať
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
