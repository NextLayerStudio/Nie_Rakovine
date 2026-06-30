import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  deleteDiscountOfferAction,
  deleteDiscountPartnerAction,
  deleteReklamaPostAction,
} from "@/lib/actions/admin-discount-partners";
import { categoryLabel } from "@/lib/discount-category";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { prisma } from "@/lib/prisma";
import { DiscountOfferForm } from "@/app/admin/discount-partners/DiscountOfferForm";
import {
  ReklamaPostForm,
  type OfferOption,
} from "@/app/admin/discount-partners/ReklamaPostForm";

export const dynamic = "force-dynamic";

export default async function AdminDiscountPartnerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    editOffer?: string;
    newOffer?: string;
    editPost?: string;
    newPost?: string;
  }>;
}) {
  const { id } = await params;
  const { editOffer, newOffer, editPost, newPost } = await searchParams;

  const partner = await prisma.discountPartner.findUnique({
    where: { id },
    include: {
      offers: { orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] },
      posts: { orderBy: [{ createdAt: "desc" }] },
    },
  });
  if (!partner) notFound();

  const editingOffer = editOffer
    ? partner.offers.find((o) => o.id === editOffer)
    : null;
  const editingPost = editPost
    ? partner.posts.find((p) => p.id === editPost)
    : null;

  const offerOptions: OfferOption[] = partner.offers.map((o, index) => ({
    id: o.id,
    label: `Karta ${index + 1}`,
  }));
  const offerLabelById = new Map(offerOptions.map((o) => [o.id, o.label]));

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

      {/* ---------------- Discount cards (image only) ---------------- */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="admin-section-title text-sm">Zľavové karty</h2>
          {!newOffer && !editOffer && (
            <Link
              href={`/admin/discount-partners/${partner.id}?newOffer=1`}
              className="inline-flex items-center gap-1 rounded-md bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft"
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
          <div className="rounded-md border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/55">
            Zatiaľ žiadne zľavové karty. Pridajte prvú (iba obrázok).
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {partner.offers.map((offer, index) => (
              <article
                key={offer.id}
                className="overflow-hidden rounded-lg ring-1 ring-brand-purple/10"
              >
                <div className="aspect-video w-full bg-brand-purple/5">
                  {offer.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={offer.imageUrl}
                      alt={`Karta ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-brand-purple/40">
                      Bez obrázka
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between bg-white px-4 py-3">
                  <span className="text-xs font-semibold text-brand-purple/70">
                    Karta {index + 1}
                    <span
                      className={`ml-2 text-[10px] font-semibold ${
                        offer.published ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {offer.published ? "Publikované" : "Koncept"}
                    </span>
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

      {/* ---------------- Reklama posts (home feed) ---------------- */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="admin-section-title text-sm">Reklama (kanál)</h2>
          {!newPost && !editPost && (
            <Link
              href={`/admin/discount-partners/${partner.id}?newPost=1`}
              className="inline-flex items-center gap-1 rounded-md bg-brand-purple px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft"
            >
              + Nová reklama
            </Link>
          )}
        </div>

        {(newPost || editPost) && (
          <div className="mb-8">
            <ReklamaPostForm
              mode={editingPost ? "edit" : "create"}
              partnerId={partner.id}
              offers={offerOptions}
              post={
                editingPost
                  ? {
                      id: editingPost.id,
                      title: editingPost.title,
                      excerpt: editingPost.excerpt,
                      coverUrl: editingPost.coverUrl,
                      linkedOfferId: editingPost.linkedOfferId,
                      published: editingPost.published,
                    }
                  : undefined
              }
            />
          </div>
        )}

        {partner.posts.length === 0 ? (
          <div className="rounded-md border border-dashed border-brand-purple/20 p-8 text-center text-sm text-brand-purple/55">
            Zatiaľ žiadna reklama. Reklama sa zobrazí v domovskom kanáli a po
            kliknutí presmeruje na zľavovú kartu.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {partner.posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-lg ring-1 ring-brand-purple/10"
              >
                <div className="aspect-video w-full bg-brand-purple/5">
                  {post.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverUrl}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-brand-purple/40">
                      Bez obrázka
                    </div>
                  )}
                </div>
                <div className="bg-white px-4 py-3">
                  <p className="truncate text-sm font-semibold text-brand-purple">
                    {post.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-brand-purple/55">
                    {post.linkedOfferId
                      ? `Odkaz: ${offerLabelById.get(post.linkedOfferId) ?? "karta"}`
                      : "Bez prepojenia"}
                    {" · "}
                    <span
                      className={
                        post.published ? "text-emerald-700" : "text-amber-700"
                      }
                    >
                      {post.published ? "Publikované" : "Koncept"}
                    </span>
                  </p>
                  <div className="mt-2 flex gap-3">
                    <Link
                      href={`/admin/discount-partners/${partner.id}?editPost=${post.id}`}
                      className="text-xs font-semibold text-brand-purple hover:underline"
                    >
                      Upraviť
                    </Link>
                    <form action={deleteReklamaPostAction}>
                      <input type="hidden" name="id" value={post.id} />
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
