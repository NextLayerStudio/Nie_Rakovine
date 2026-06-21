import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import { DiscountPartnerForm } from "@/app/admin/discount-partners/DiscountPartnerForm";

export const dynamic = "force-dynamic";

export default async function EditDiscountPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await prisma.discountPartner.findUnique({ where: { id } });
  if (!partner) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Upraviť zľavový profil"
        description={partner.displayName}
        backHref={`/admin/discount-partners/${partner.id}`}
        backLabel="Späť"
      />
      <DiscountPartnerForm mode="edit" partner={partner} />
    </div>
  );
}
