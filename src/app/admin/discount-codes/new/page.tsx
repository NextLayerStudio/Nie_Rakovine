import { DiscountCodeForm } from "../DiscountCodeForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function NewDiscountCodePage() {
  return (
    <div>
      <AdminPageHeader
        title="Nový zľavový kód"
        description="Vytvorte kód, ktorý zákazník zadá pri platbe za mesačné alebo ročné členstvo."
        backHref="/admin/discount-codes"
        backLabel="Späť na zľavové kódy"
      />
      <DiscountCodeForm mode="create" />
    </div>
  );
}
