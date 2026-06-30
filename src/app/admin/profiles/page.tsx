import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteClubProfileAction, toggleClubProfilePublishedAction } from "@/lib/actions/admin-profiles";
import { deleteDiscountPartnerAction, toggleDiscountPartnerPublishedAction } from "@/lib/actions/admin-discount-partners";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { categoryLabel } from "@/lib/discount-category";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { profileCategoryLabel } from "@/lib/profile-category";

export const dynamic = "force-dynamic";

type Tab = "content" | "discount";

export default async function AdminProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  const tab: Tab = sp.tab === "discount" ? "discount" : "content";

  // Fetch counts for tab badges + full list only for the active tab
  const [profileCount, discountCount, profiles, discountPartners] = await Promise.all([
    prisma.clubProfile.count(),
    prisma.discountPartner.count(),
    tab === "content"
      ? prisma.clubProfile.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          include: { _count: { select: { posts: true, events: true } } },
        })
      : Promise.resolve([]),
    tab === "discount"
      ? prisma.discountPartner.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          include: { _count: { select: { offers: true } } },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Profily"
        description="Obsahové profily (príspevky, podujatia) a zľavové profily partnerov."
        actions={
          tab === "content" ? (
            <Link href="/admin/profiles/new" className="admin-btn-primary">
              + Nový profil
            </Link>
          ) : (
            <Link href="/admin/discount-partners/new" className="admin-btn-primary">
              + Pridať partnera
            </Link>
          )
        }
      />

      {/* Tab switcher */}
      <div className="mb-6 flex gap-1 border-b border-brand-purple/10">
        <Link
          href="/admin/profiles?tab=content"
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            tab === "content"
              ? "border-brand-purple text-brand-purple"
              : "border-transparent text-brand-purple/50 hover:text-brand-purple"
          }`}
        >
          Obsahové profily
          <span className="ml-2 rounded bg-brand-purple/8 px-1.5 py-0.5 text-[11px] font-bold text-brand-purple/60">
            {profileCount}
          </span>
        </Link>
        <Link
          href="/admin/profiles?tab=discount"
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            tab === "discount"
              ? "border-brand-purple text-brand-purple"
              : "border-transparent text-brand-purple/50 hover:text-brand-purple"
          }`}
        >
          Zľavové profily
          <span className="ml-2 rounded bg-brand-purple/8 px-1.5 py-0.5 text-[11px] font-bold text-brand-purple/60">
            {discountCount}
          </span>
        </Link>
      </div>

      {/* Content profiles list */}
      {tab === "content" && (
        <div className="admin-card overflow-hidden">
          {profiles.length === 0 ? (
            <p className="p-8 text-center text-sm text-brand-purple/50">
              Zatiaľ žiadne profily. Vytvorte prvý profil.
            </p>
          ) : (
            <ul className="divide-y divide-brand-purple/8">
              {profiles.map((p) => (
                <li key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-purple/[0.02]">
                  <div
                    className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center ring-1 ring-brand-purple/10"
                    style={profileAvatarStyle(p.avatarUrl)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-brand-purple">
                      {p.displayName}
                    </p>
                    <p className="text-xs text-brand-purple/50">
                      @{p.handle}
                      {p.category && (
                        <span className="ml-2 text-brand-pink/80">{profileCategoryLabel(p.category)}</span>
                      )}
                      <span className="ml-2">{p._count.posts} prísp. · {p._count.events} podujatí</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/admin/profiles/${p.id}`}
                      className="rounded bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white hover:brightness-110"
                    >
                      Spravovať
                    </Link>
                    <Link
                      href={`/home/profiles/${p.handle}`}
                      className="rounded border border-brand-purple/20 px-3.5 py-1.5 text-xs font-semibold text-brand-purple hover:bg-brand-purple/5"
                    >
                      Náhľad
                    </Link>
                    <form action={toggleClubProfilePublishedAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="current" value={String(p.published)} />
                      <button
                        type="submit"
                        className={`rounded px-3.5 py-1.5 text-xs font-semibold transition ${
                          p.published
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {p.published ? "Publikovaný" : "Skrytý"}
                      </button>
                    </form>
                    <form action={deleteClubProfileAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Zmazať
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Discount partners list */}
      {tab === "discount" && (
        <div className="admin-card overflow-hidden">
          {discountPartners.length === 0 ? (
            <p className="p-8 text-center text-sm text-brand-purple/50">
              Zatiaľ žiadni partneri. Pridajte prvého partnera.
            </p>
          ) : (
            <ul className="divide-y divide-brand-purple/8">
              {discountPartners.map((p) => (
                <li key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-purple/[0.02]">
                  <div
                    className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center ring-1 ring-brand-purple/10"
                    style={profileAvatarStyle(p.avatarUrl)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-brand-purple">
                      {p.displayName}
                    </p>
                    <p className="text-xs text-brand-purple/50">
                      @{p.handle}
                      <span className="ml-2 text-brand-pink/80">{categoryLabel(p.category)}</span>
                      {p.featured && (
                        <span className="ml-2 font-medium text-brand-pink">★ Odporúčaná</span>
                      )}
                      <span className="ml-2">{p._count.offers} kariet</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/admin/discount-partners/${p.id}`}
                      className="rounded bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white hover:brightness-110"
                    >
                      Spravovať
                    </Link>
                    <Link
                      href={`/home/zlavy/${p.handle}`}
                      className="rounded border border-brand-purple/20 px-3.5 py-1.5 text-xs font-semibold text-brand-purple hover:bg-brand-purple/5"
                    >
                      Náhľad
                    </Link>
                    <form action={toggleDiscountPartnerPublishedAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="current" value={String(p.published)} />
                      <button
                        type="submit"
                        className={`rounded px-3.5 py-1.5 text-xs font-semibold transition ${
                          p.published
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {p.published ? "Publikovaný" : "Skrytý"}
                      </button>
                    </form>
                    <form action={deleteDiscountPartnerAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Zmazať
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
