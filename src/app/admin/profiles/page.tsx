import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteClubProfileAction, toggleClubProfilePublishedAction } from "@/lib/actions/admin-profiles";
import { deleteDiscountPartnerAction, toggleDiscountPartnerPublishedAction } from "@/lib/actions/admin-discount-partners";
import { categoryLabel } from "@/lib/discount-category";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminProfilesList, type AdminProfileListItem } from "@/components/admin/AdminProfilesList";
import { profileCategoryLabel } from "@/lib/profile-category";

const collator = new Intl.Collator("sk", { sensitivity: "base" });

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
          include: { _count: { select: { posts: true, events: true } } },
        })
      : Promise.resolve([]),
    tab === "discount"
      ? prisma.discountPartner.findMany({
          include: { _count: { select: { offers: true } } },
        })
      : Promise.resolve([]),
  ]);

  const profileItems: AdminProfileListItem[] = profiles
    .map((p) => ({
      id: p.id,
      displayName: p.displayName,
      handle: p.handle,
      avatarUrl: p.avatarUrl,
      published: p.published,
      categoryLabel: p.category ? profileCategoryLabel(p.category) : null,
      countsText: `${p._count.posts} prísp. · ${p._count.events} podujatí`,
      manageHref: `/admin/profiles/${p.id}`,
      previewHref: `/home/profiles/${p.handle}`,
    }))
    .sort((a, b) => collator.compare(a.displayName, b.displayName));

  const discountItems: AdminProfileListItem[] = discountPartners
    .map((p) => ({
      id: p.id,
      displayName: p.displayName,
      handle: p.handle,
      avatarUrl: p.avatarUrl,
      published: p.published,
      categoryLabel: categoryLabel(p.category),
      featured: p.featured,
      countsText: `${p._count.offers} kariet`,
      manageHref: `/admin/discount-partners/${p.id}`,
      previewHref: `/home/zlavy/${p.handle}`,
    }))
    .sort((a, b) => collator.compare(a.displayName, b.displayName));

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
        <AdminProfilesList
          items={profileItems}
          toggleAction={toggleClubProfilePublishedAction}
          deleteAction={deleteClubProfileAction}
          deleteConfirmText="Naozaj chceš zmazať tento profil? Zmažú sa aj všetky jeho príspevky a udalosti. Táto akcia je nezvratná."
          emptyText="Zatiaľ žiadne profily. Vytvorte prvý profil."
          listId="admin-content-profiles"
        />
      )}

      {/* Discount partners list */}
      {tab === "discount" && (
        <AdminProfilesList
          items={discountItems}
          toggleAction={toggleDiscountPartnerPublishedAction}
          deleteAction={deleteDiscountPartnerAction}
          deleteConfirmText="Naozaj chceš zmazať tohto discount partnera? Zmažú sa aj všetky jeho karty. Táto akcia je nezvratná."
          emptyText="Zatiaľ žiadni partneri. Pridajte prvého partnera."
          listId="admin-discount-profiles"
        />
      )}
    </div>
  );
}
