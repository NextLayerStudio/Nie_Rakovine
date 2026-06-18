import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ForumAdminForm } from "../../ForumAdminForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminForumEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const forum = await prisma.forum.findUnique({ where: { id } });
  if (!forum) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Upraviť fórum"
        description={forum.title}
        backHref={`/admin/forums/${forum.id}`}
        backLabel="Späť na fórum"
      />

      <ForumAdminForm mode="edit" forum={forum} />
    </div>
  );
}
