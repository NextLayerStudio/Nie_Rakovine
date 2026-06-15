import { ClubProfileForm } from "../ClubProfileForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function NewClubProfilePage() {
  return (
    <div>
      <AdminPageHeader
        title="Nový profil"
        description="Vytvorte nový profil, ktorý bude publikovať obsah a podujatia."
        backHref="/admin/profiles"
        backLabel="Späť na profily"
      />
      <ClubProfileForm mode="create" />
    </div>
  );
}
