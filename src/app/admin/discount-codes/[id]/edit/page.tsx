import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DiscountCodeForm } from "../../DiscountCodeForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function EditDiscountCodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const discountCode = await prisma.membershipDiscountCode.findUnique({
    where: { id },
  });
  if (!discountCode) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Upraviť zľavový kód"
        description={discountCode.code}
        backHref="/admin/discount-codes"
        backLabel="Späť na zľavové kódy"
      />
      <DiscountCodeForm mode="edit" discountCode={discountCode} />
    </div>
  );
}
