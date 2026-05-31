import { ClubProfileForm } from "../ClubProfileForm";

export default function NewClubProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Nový profil</h1>
      <ClubProfileForm mode="create" />
    </div>
  );
}
