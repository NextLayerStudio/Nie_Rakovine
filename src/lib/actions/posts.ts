"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
import { notifyProfileFollowersNewPost } from "@/lib/notifications";
import { parseCancerTypes } from "@/lib/cancer-type";
import type { PostType } from "@prisma/client";

export type ActionState = { ok: boolean; message?: string };

// ------ Admin: create post ---------------------------------------------
export async function createPostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const type = String(formData.get("type") ?? "") as PostType;
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim() || null;
  const coverUrl = String(formData.get("coverUrl") ?? "").trim() || null;
  const videoUrl = String(formData.get("videoUrl") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const profileId = String(formData.get("profileId") ?? "").trim() || null;
  const cancerTypes = parseCancerTypes(formData.getAll("cancerTypes"));

  if (!title || !["VIDEO", "ARTICLE", "RECIPE"].includes(type)) {
    return { ok: false, message: "Vyplňte názov a typ obsahu." };
  }

  const post = await prisma.post.create({
    data: {
      type,
      title,
      excerpt,
      body,
      coverUrl,
      videoUrl,
      published,
      publishedAt: published ? new Date() : null,
      profileId,
      cancerTypes,
    },
    include: { profile: { select: { id: true, displayName: true } } },
  });

  if (published) {
    await notifyProfileFollowersNewPost(post);
  }

  revalidatePaths(profileId);
  redirect(profileId ? `/admin/profiles/${profileId}` : "/admin/profiles");
}

export async function updatePostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Chýba identifikátor." };

  const type = String(formData.get("type") ?? "") as PostType;
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim() || null;
  const coverUrl = String(formData.get("coverUrl") ?? "").trim() || null;
  const videoUrl = String(formData.get("videoUrl") ?? "").trim() || null;
  const published = formData.get("published") === "on";

  const profileId = String(formData.get("profileId") ?? "").trim() || null;
  const cancerTypes = parseCancerTypes(formData.getAll("cancerTypes"));

  const existing = await prisma.post.findUnique({ where: { id } });

  const post = await prisma.post.update({
    where: { id },
    data: {
      type,
      title,
      excerpt,
      body,
      coverUrl,
      videoUrl,
      published,
      publishedAt: published ? new Date() : null,
      profileId,
      cancerTypes,
    },
    include: { profile: { select: { id: true, displayName: true } } },
  });

  if (published && !existing?.published) {
    await notifyProfileFollowersNewPost(post);
  }

  revalidatePaths(profileId);
  redirect(profileId ? `/admin/profiles/${profileId}` : "/admin/profiles");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { profileId: true },
  });
  await prisma.post.delete({ where: { id } });
  revalidatePaths(post?.profileId ?? null);
  redirect(
    post?.profileId
      ? `/admin/profiles/${post.profileId}`
      : "/admin/profiles",
  );
}

function revalidatePaths(profileId: string | null) {
  revalidatePath("/admin/profiles");
  if (profileId) revalidatePath(`/admin/profiles/${profileId}`);
  revalidatePath("/home");
  revalidatePath("/home/articles");
  revalidatePath("/home/recipes");
  revalidatePath("/home/profiles");
  revalidatePath("/home/notifications");
}

// ------ Public: like / unlike a post -----------------------------------
export async function togglePostLikeAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const postId = String(formData.get("postId") ?? "");
  if (!postId) return;

  const existing = await prisma.articleLike.findUnique({
    where: { userId_postId: { userId: user.id, postId } },
  });

  if (existing) {
    await prisma.articleLike.delete({
      where: { userId_postId: { userId: user.id, postId } },
    });
  } else {
    await prisma.articleLike.create({
      data: { userId: user.id, postId },
    });
  }

  revalidatePath("/home");
  revalidatePath("/home/articles");
  revalidatePath("/home/recipes");
  revalidatePath("/home/forums");
  revalidatePath("/home/profiles");
}
