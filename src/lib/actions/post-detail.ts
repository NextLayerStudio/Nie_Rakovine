"use server";

import { prisma } from "@/lib/prisma";
import { buildPostGallery } from "@/lib/post-display";
import { requireActionUser } from "@/lib/safe-action";

export type PostDetailPayload = {
  id: string;
  type: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  gallery: string[];
  profileName: string | null;
  profileHandle: string | null;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  saved: boolean;
};

export async function fetchPostDetailAction(postId: string): Promise<
  | { ok: true; post: PostDetailPayload }
  | { ok: false; message: string }
> {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false, message: auth.message };

  const post = await prisma.post.findFirst({
    where: { id: postId, published: true },
    include: {
      profile: { select: { displayName: true, handle: true } },
      images: { orderBy: { sortOrder: "asc" } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) {
    return { ok: false, message: "Príspevok sa nenašiel." };
  }

  const [like, saved] = await Promise.all([
    prisma.articleLike.findUnique({
      where: { userId_postId: { userId: auth.user.id, postId } },
      select: { id: true },
    }),
    prisma.savedPost.findUnique({
      where: { userId_postId: { userId: auth.user.id, postId } },
      select: { id: true },
    }),
  ]);

  return {
    ok: true,
    post: {
      id: post.id,
      type: post.type,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      videoUrl: post.videoUrl,
      audioUrl: post.audioUrl,
      gallery: buildPostGallery(post.coverUrl, post.images),
      profileName: post.profile?.displayName ?? null,
      profileHandle: post.profile?.handle ?? null,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      liked: !!like,
      saved: !!saved,
    },
  };
}
