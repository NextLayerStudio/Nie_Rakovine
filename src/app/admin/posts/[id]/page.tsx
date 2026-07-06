import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "../PostForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { resolveVideoPlaybackUrl } from "@/lib/video-blob";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!post) notFound();

  const videoPreviewUrl = await resolveVideoPlaybackUrl(post.videoUrl);

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Upraviť obsah"
        description={post.title}
        backHref={
          post.profileId ? `/admin/profiles/${post.profileId}` : "/admin/profiles"
        }
        backLabel="Späť na profil"
      />
      <PostForm mode="edit" post={post} videoPreviewUrl={videoPreviewUrl ?? undefined} />
    </div>
  );
}
