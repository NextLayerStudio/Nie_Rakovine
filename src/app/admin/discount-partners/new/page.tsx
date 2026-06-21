import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DiscountPartnerForm } from "@/app/admin/discount-partners/DiscountPartnerForm";

export default function NewDiscountPartnerPage() {
  return (
    <div>
      <AdminPageHeader
        title="Nový zľavový profil"
        description="Značka partnera v sekcii Zľavy — rovnaké údaje ako bežný profil, namiesto typu rakoviny vyberte kategóriu."
        backHref="/admin/profiles"
        backLabel="Späť na profily"
      />
      <DiscountPartnerForm mode="create" />
    </div>
  );
}
