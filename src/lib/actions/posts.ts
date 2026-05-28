"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
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

  if (!title || !["VIDEO", "ARTICLE", "RECIPE"].includes(type)) {
    return { ok: false, message: "Vyplňte názov a typ obsahu." };
  }

  await prisma.post.create({
    data: {
      type,
      title,
      excerpt,
      body,
      coverUrl,
      videoUrl,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/home");
  revalidatePath("/home/articles");
  revalidatePath("/home/recipes");
  redirect("/admin/posts");
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

  await prisma.post.update({
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
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/home");
  revalidatePath("/home/articles");
  revalidatePath("/home/recipes");
  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
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
}
