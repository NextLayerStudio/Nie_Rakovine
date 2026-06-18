import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClubProfileForm } from "../../ClubProfileForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminProfileEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await prisma.clubProfile.findUnique({ where: { id } });
  if (!profile) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Upraviť profil"
        description={profile.displayName}
        backHref={`/admin/profiles/${profile.id}`}
        backLabel="Späť na profil"
      />

      <ClubProfileForm mode="edit" profile={profile} />
    </div>
  );
}
