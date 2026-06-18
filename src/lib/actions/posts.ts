"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
import { notifyProfileFollowersNewPost } from "@/lib/notifications";
import { parseCancerTypes } from "@/lib/cancer-type";
import {
  resolveImageField,
  resolveVideoField,
  saveUploadedImages,
} from "@/lib/uploads";
import type { PostType } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type ActionState = { ok: boolean; message?: string };

type DbClient = Prisma.TransactionClient | typeof prisma;

async function syncPostGallery(
  postId: string,
  formData: FormData,
  db: DbClient = prisma,
): Promise<void> {
  const removeIds = formData
    .getAll("removeImageIds")
    .map(String)
    .filter(Boolean);

  if (removeIds.length > 0) {
    await db.postImage.deleteMany({
      where: { id: { in: removeIds }, postId },
    });
  }

  const newUrls = await saveUploadedImages(formData, "galleryFiles", "posts");
  if (newUrls.length === 0) return;

  const existingCount = await db.postImage.count({ where: { postId } });

  await db.postImage.createMany({
    data: newUrls.map((url, index) => ({
      postId,
      url,
      sortOrder: existingCount + index,
    })),
  });
}

function galleryErrorMessage(err: unknown): string {
  if (
    err instanceof TypeError &&
    (String(err.message).includes("findFirst") ||
      String(err.message).includes("createMany") ||
      String(err.message).includes("deleteMany") ||
      String(err.message).includes("count"))
  ) {
    return "Galéria obrázkov nie je pripravená. Spustite npx prisma migrate deploy, npx prisma generate a reštartujte dev server.";
  }
  return err instanceof Error ? err.message : "Nepodarilo sa nahrať galériu.";
}

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
  const published = formData.get("published") === "on";
  const profileId = String(formData.get("profileId") ?? "").trim() || null;
  const cancerTypes = parseCancerTypes(formData.getAll("cancerTypes"));

  if (!title || !["VIDEO", "ARTICLE", "RECIPE"].includes(type)) {
    return { ok: false, message: "Vyplňte názov a typ obsahu." };
  }

  let coverUrl: string | null;
  try {
    coverUrl = await resolveImageField(
      formData,
      "coverFile",
      "coverUrl",
      "posts",
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať obrázok.",
    };
  }

  let videoUrl: string | null;
  try {
    videoUrl = (await resolveVideoField(formData, "videoFile", "videoUrl")) ?? null;
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať video.",
    };
  }

  let post;
  try {
    post = await prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
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

      await syncPostGallery(created.id, formData, tx);
      return created;
    });
  } catch (err) {
    return {
      ok: false,
      message: galleryErrorMessage(err),
    };
  }

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
  const published = formData.get("published") === "on";

  const profileId = String(formData.get("profileId") ?? "").trim() || null;
  const cancerTypes = parseCancerTypes(formData.getAll("cancerTypes"));

  const existing = await prisma.post.findUnique({ where: { id } });

  let coverUrl: string | null;
  try {
    coverUrl = await resolveImageField(
      formData,
      "coverFile",
      "coverUrl",
      "posts",
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať obrázok.",
    };
  }

  if (coverUrl === null && existing?.coverUrl) {
    coverUrl = existing.coverUrl;
  }

  let videoUrl: string | null | undefined;
  try {
    videoUrl = await resolveVideoField(
      formData,
      "videoFile",
      "videoUrl",
      existing?.videoUrl,
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať video.",
    };
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      type,
      title,
      excerpt,
      body,
      coverUrl,
      videoUrl: videoUrl ?? null,
      published,
      publishedAt: published ? new Date() : null,
      profileId,
      cancerTypes,
    },
    include: { profile: { select: { id: true, displayName: true } } },
  });

  try {
    await syncPostGallery(post.id, formData);
  } catch (err) {
    return { ok: false, message: galleryErrorMessage(err) };
  }

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
  revalidatePath("/home/posts");
}

