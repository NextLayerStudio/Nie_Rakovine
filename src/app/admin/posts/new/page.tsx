import { PostForm } from "../PostForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ profileId?: string }>;
}) {
  const { profileId } = await searchParams;

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Nový obsah"
        description="Pridajte video, článok alebo recept pre členov."
        backHref={profileId ? `/admin/profiles/${profileId}` : "/admin/profiles"}
        backLabel="Späť na profil"
      />
      <PostForm mode="create" profileId={profileId} />
    </div>
  );
}
