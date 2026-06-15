import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteClubProfileAction } from "@/lib/actions/admin-profiles";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

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
      <AdminPageHeader
        title="Profily"
        description="Instagram štýl — admin spravuje profil, príspevky a podujatia. Používatelia profily len prezerajú."
        actions={
          <Link href="/admin/profiles/new" className="admin-btn-primary">
            + Nový profil
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {profiles.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/60">
            Zatiaľ žiadne profily. Vytvorte prvý profil.
          </p>
        )}
        {profiles.map((p) => (
          <article
            key={p.id}
            className="admin-card group flex gap-4 overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className="h-16 w-16 shrink-0 rounded-2xl bg-cover bg-center ring-1 ring-brand-purple/10"
              style={profileAvatarStyle(p.avatarUrl)}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate font-bold text-brand-purple">
                    {p.displayName}
                  </h2>
                  <p className="text-xs text-brand-purple/60">@{p.handle}</p>
                </div>
                <span
                  className={`admin-badge ${
                    p.published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {p.published ? "Publikovaný" : "Skrytý"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="admin-badge bg-brand-purple/8 text-brand-purple/80">
                  {p._count.posts} príspevkov
                </span>
                <span className="admin-badge bg-brand-purple/8 text-brand-purple/80">
                  {p._count.events} podujatí
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3 border-t border-brand-purple/8 pt-3">
                <Link
                  href={`/admin/profiles/${p.id}`}
                  className="text-xs font-semibold text-brand-purple hover:underline"
                >
                  Spravovať →
                </Link>
                <Link
                  href={`/home/profiles/${p.handle}`}
                  className="text-xs font-medium text-brand-purple/60 hover:underline"
                >
                  Náhľad
                </Link>
                <form action={deleteClubProfileAction} className="ml-auto">
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="admin-link-danger">
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
