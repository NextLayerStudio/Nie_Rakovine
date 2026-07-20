import "server-only";

import type { SessionPayload } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export function mediaAssetPath(id: string): string {
  return `/api/media/${id}`;
}

/** Cover images of published events are shown to anonymous visitors on the public /podujatia page. */
export async function isPublishedEventCoverAsset(assetId: string): Promise<boolean> {
  const path = mediaAssetPath(assetId);
  const event = await prisma.event.findFirst({
    where: { published: true, coverUrl: path },
    select: { id: true },
  });
  return event !== null;
}

type MediaAssetRecord = {
  id: string;
  category: string | null;
  uploadedById: string | null;
};

/** Whether an authenticated user may download this stored media asset. */
export async function canAccessMediaAsset(
  asset: MediaAssetRecord,
  session: SessionPayload,
): Promise<boolean> {
  if (session.role === "ADMIN") return true;
  if (asset.uploadedById === session.userId) return true;

  const path = mediaAssetPath(asset.id);

  const [
    avatarInUse,
    publishedPost,
    publishedPostBody,
    publishedGallery,
    publishedEvent,
    publishedClubProfile,
    publishedDiscountPartner,
    publishedDiscountOffer,
    publishedForum,
    threadWithCover,
    unpublishedPost,
    unpublishedGallery,
    unpublishedDiscountPartner,
    unpublishedDiscountOffer,
  ] = await Promise.all([
    prisma.userProfile.findFirst({
      where: { avatarUrl: path },
      select: { id: true },
    }),
    prisma.post.findFirst({
      where: {
        published: true,
        OR: [{ coverUrl: path }, { videoUrl: path }, { audioUrl: path }],
      },
      select: { id: true },
    }),
    // Images inserted inline into the article body via the Tiptap editor
    // (ImageFigure node) - not tracked as a cover/gallery/video field.
    prisma.post.findFirst({
      where: { published: true, body: { contains: path } },
      select: { id: true },
    }),
    prisma.postImage.findFirst({
      where: { url: path, post: { published: true } },
      select: { id: true },
    }),
    prisma.event.findFirst({
      where: { published: true, coverUrl: path },
      select: { id: true },
    }),
    prisma.clubProfile.findFirst({
      where: {
        published: true,
        OR: [{ avatarUrl: path }, { coverUrl: path }],
      },
      select: { id: true },
    }),
    prisma.discountPartner.findFirst({
      where: {
        published: true,
        OR: [{ avatarUrl: path }, { coverUrl: path }],
      },
      select: { id: true },
    }),
    prisma.discountOffer.findFirst({
      where: { published: true, imageUrl: path },
      select: { id: true },
    }),
    prisma.forum.findFirst({
      where: { published: true, imageUrl: path },
      select: { id: true },
    }),
    prisma.forumThread.findFirst({
      where: { coverUrl: path },
      select: { status: true, authorId: true },
    }),
    prisma.post.findFirst({
      where: {
        published: false,
        OR: [{ coverUrl: path }, { videoUrl: path }, { audioUrl: path }],
      },
      select: { id: true },
    }),
    prisma.postImage.findFirst({
      where: { url: path, post: { published: false } },
      select: { id: true },
    }),
    prisma.discountPartner.findFirst({
      where: {
        published: false,
        OR: [{ avatarUrl: path }, { coverUrl: path }],
      },
      select: { id: true },
    }),
    prisma.discountOffer.findFirst({
      where: { published: false, imageUrl: path },
      select: { id: true },
    }),
  ]);

  if (avatarInUse) return true;
  if (publishedPost || publishedPostBody || publishedGallery || publishedEvent) {
    return true;
  }
  if (publishedClubProfile || publishedDiscountPartner || publishedDiscountOffer) {
    return true;
  }
  if (publishedForum) return true;

  if (threadWithCover) {
    if (threadWithCover.status === "APPROVED") return true;
    if (threadWithCover.authorId === session.userId) return true;
  }

  // Draft admin content is not exposed to regular members.
  if (
    unpublishedPost ||
    unpublishedGallery ||
    unpublishedDiscountPartner ||
    unpublishedDiscountOffer
  ) {
    return false;
  }

  return false;
}
