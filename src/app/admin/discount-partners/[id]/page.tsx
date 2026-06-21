import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { deleteDiscountOfferAction, deleteDiscountPartnerAction } from "@/lib/actions/admin-discount-partners";
import { categoryLabel } from "@/lib/discount-category";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { prisma } from "@/lib/prisma";
import { DiscountOfferForm } from "@/app/admin/discount-partners/DiscountOfferForm";

export const dynamic = "force-dynamic";

export default async function AdminDiscountPartnerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ editOffer?: string; newOffer?: string }>;
}) {
  const { id } = await params;
  const { editOffer, newOffer } = await searchParams;

  const partner = await prisma.discountPartner.findUnique({
    where: { id },
    include: {
      offers: { orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] },
    },
  });
  if (!partner) notFound();

  const editingOffer = editOffer
    ? partner.offers.find((o) => o.id === editOffer)
    : null;

  return (
    <div>
      <AdminPageHeader
        title={partner.displayName}
        description={`@${partner.handle} · ${categoryLabel(partner.category)}`}
        backHref="/admin/profiles"
        backLabel="Späť na profily"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/home/zlavy/${partner.handle}`}
              className="admin-btn-outline"
            >
              Náhľad v aplikácii →
            </Link>
            <Link
              href={`/admin/discount-partners/${partner.id}/edit`}
              className="admin-btn-primary"
            >
              Upraviť profil
            </Link>
          </div>
        }
      />

      <article className="admin-card mb-8 flex gap-4 p-4">
        <div
          className="h-16 w-16 shrink-0 rounded-full bg-cover bg-center ring-1 ring-brand-purple/10"
          style={profileAvatarStyle(partner.avatarUrl)}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="admin-badge bg-brand-purple/8 text-brand-purple/80">
              {categoryLabel(partner.category)}
            </span>
            {partner.featured && (
              <span className="admin-badge bg-brand-pink/15 text-brand-pink">
                Odporúčaná
              </span>
            )}
            <span
              className={`admin-badge ${
                partner.published
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {partner.published ? "Publikovaná" : "Skrytá"}
            </span>
          </div>
          {partner.bio && (
            <p className="mt-2 text-sm text-brand-purple/70">{partner.bio}</p>
          )}
          <form action={deleteDiscountPartnerAction} className="mt-3">
            <input type="hidden" name="id" value={partner.id} />
            <button type="submit" className="admin-link-danger">
              Zmazať značku
            </button>
          </form>
        </div>
      </article>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="admin-section-title text-sm">Zľavové karty</h2>
          {!newOffer && !editOffer && (
            <Link
              href={`/admin/discount-partners/${partner.id}?newOffer=1`}
              className="inline-flex items-center gap-1 rounded-pill bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft"
            >
              + Nová karta
            </Link>
          )}
        </div>

        {(newOffer || editOffer) && (
          <div className="mb-8">
            <DiscountOfferForm
              mode={editingOffer ? "edit" : "create"}
              partnerId={partner.id}
              offer={editingOffer ?? undefined}
            />
          </div>
        )}

        {partner.offers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/55">
            Zatiaľ žiadne zľavové karty. Pridajte prvú.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {partner.offers.map((offer) => (
              <article
                key={offer.id}
                className="overflow-hidden rounded-2xl ring-1 ring-brand-purple/10"
              >
                <div
                  className="relative flex min-h-[140px] flex-col justify-end p-4"
                  style={{ backgroundColor: offer.accentColor ?? "#F5D5E0" }}
                >
                  {offer.discountText && (
                    <p className="text-2xl font-black text-brand-purple/90">
                      {offer.discountText}
                    </p>
                  )}
                  <p className="mt-1 text-sm font-bold text-brand-purple/85">
                    {offer.title}
                  </p>
                </div>
                <div className="flex items-center justify-between bg-white px-4 py-3">
                  <span
                    className={`text-[10px] font-semibold ${
                      offer.published ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {offer.published ? "Publikované" : "Koncept"}
                  </span>
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/discount-partners/${partner.id}?editOffer=${offer.id}`}
                      className="text-xs font-semibold text-brand-purple hover:underline"
                    >
                      Upraviť
                    </Link>
                    <form action={deleteDiscountOfferAction}>
                      <input type="hidden" name="id" value={offer.id} />
                      <input type="hidden" name="partnerId" value={partner.id} />
                      <button type="submit" className="admin-link-danger text-xs">
                        Zmazať
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
