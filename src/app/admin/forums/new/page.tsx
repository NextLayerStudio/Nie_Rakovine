import { ForumAdminForm } from "../ForumAdminForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function NewForumPage() {
  return (
    <div>
      <AdminPageHeader
        title="Nové fórum"
        description="Vytvorte novú tému, do ktorej sa môžu používatelia zapojiť."
        backHref="/admin/forums"
        backLabel="Späť na fóra"
      />
      <ForumAdminForm mode="create" />
    </div>
  );
}
