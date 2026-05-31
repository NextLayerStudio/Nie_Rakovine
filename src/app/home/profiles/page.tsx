import Link from "next/link";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { relevantWhere, sortByRelevance } from "@/lib/cancer-personalization";

export const dynamic = "force-dynamic";

export default async function ProfilesListPage() {
  const user = await requireUser();
  const userTypes = user.profile?.cancerTypes ?? [];

  const profilesRaw = await prisma.clubProfile.findMany({
    where: { published: true, ...relevantWhere(userTypes) },
    orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
    include: { _count: { select: { posts: true } } },
  });
  const profiles = sortByRelevance(profilesRaw, userTypes);

  return (
    <>
      <FeedHeaderWrapper />

      <section className="px-5 pb-24">
        <h1 className="text-sm font-bold uppercase tracking-wide text-brand-purple">
          Profily
        </h1>
        <p className="mt-1 text-xs text-brand-purple/70">
          Objavte obsah a podujatia od ONKO KLUBU.
        </p>

        <ul className="mt-4 space-y-3">
          {profiles.length === 0 && (
            <li className="rounded-3xl bg-white p-6 text-center text-sm text-brand-purple/70 shadow-card">
              Zatiaľ žiadne profily.
            </li>
          )}
          {profiles.map((p) => (
            <li key={p.id}>
              <Link
                href={`/home/profiles/${p.handle}`}
                className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card"
              >
                <div
                  className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center"
                  style={
                    p.avatarUrl
                      ? { backgroundImage: `url(${p.avatarUrl})` }
                      : {
                          background:
                            "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)",
                        }
                  }
                />
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-brand-purple">
                    {p.displayName}
                  </h2>
                  <p className="text-xs text-brand-purple/60">
                    @{p.handle} · {p._count.posts} príspevkov
                  </p>
                  {p.bio && (
                    <p className="mt-1 line-clamp-2 text-xs text-brand-purple/80">
                      {p.bio}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
