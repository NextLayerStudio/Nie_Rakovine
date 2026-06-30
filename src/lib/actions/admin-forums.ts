"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { parseCancerTypes } from "@/lib/cancer-type";
import {
  notifyForumCommentApproved,
  notifyForumThreadApproved,
} from "@/lib/notifications";

export type ActionState = { ok: boolean; message?: string };

// ---------- Admin: create / edit forums (only admin) --------------------
export async function createForumAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const accentColor =
    String(formData.get("accentColor") ?? "").trim() || "#6F2380";
  const published = formData.get("published") === "on";
  const cancerTypes = parseCancerTypes(formData.getAll("cancerTypes"));

  if (!title) return { ok: false, message: "Zadajte názov fóra." };

  await prisma.forum.create({
    data: {
      title,
      description,
      imageUrl,
      accentColor,
      published,
      cancerTypes,
      createdById: null,
    },
  });

  revalidatePath("/admin/forums");
  revalidatePath("/home/forums");
  redirect("/admin/forums");
}

export async function updateForumAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const accentColor =
    String(formData.get("accentColor") ?? "").trim() || "#6F2380";
  const published = formData.get("published") === "on";
  const cancerTypes = parseCancerTypes(formData.getAll("cancerTypes"));

  if (!id || !title) return { ok: false, message: "Chýba názov." };

  await prisma.forum.update({
    where: { id },
    data: { title, description, imageUrl, accentColor, published, cancerTypes },
  });

  revalidatePath("/admin/forums");
  revalidatePath(`/admin/forums/${id}`);
  revalidatePath(`/admin/forums/${id}/edit`);
  revalidatePath("/home/forums");
  revalidatePath(`/home/forums/${id}`);
  redirect(`/admin/forums/${id}`);
}

export async function toggleForumPublishedAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const current = formData.get("current") === "true";
  if (!id) return;
  await prisma.forum.update({ where: { id }, data: { published: !current } });
  revalidatePath("/admin/forums");
  revalidatePath("/home/forums");
}

export async function deleteForumAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.forum.delete({ where: { id } });
  revalidatePath("/admin/forums");
  revalidatePath("/home/forums");
  redirect("/admin/forums");
}

/** Approve a user-proposed forum: make it visible to everyone. */
export async function approveForumAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.forum.update({ where: { id }, data: { published: true } });
  revalidatePath("/admin/forums");
  revalidatePath("/admin/forums/moderation");
  revalidatePath("/home/forums");
}

/** Reject a user-proposed forum by deleting it. */
export async function rejectForumAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.forum.delete({ where: { id } });
  revalidatePath("/admin/forums");
  revalidatePath("/admin/forums/moderation");
  revalidatePath("/home/forums");
}

// ---------- Admin: forum posts (only admin publishes) --------------------
async function revalidateForumPaths(forumId: string, threadId?: string) {
  revalidatePath("/admin/forums");
  revalidatePath("/admin/forums/moderation");
  revalidatePath(`/admin/forums/${forumId}`);
  revalidatePath(`/admin/forums/${forumId}/edit`);
  revalidatePath("/home/forums");
  revalidatePath(`/home/forums/${forumId}`);
  revalidatePath("/home/notifications");
  if (threadId) revalidatePath(`/home/forums/${forumId}/${threadId}`);
  revalidateTag("pending-moderation");
}

export async function approveThreadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const thread = await prisma.forumThread.update({
    where: { id },
    data: { status: "APPROVED" },
    include: { forum: { select: { title: true } } },
  });
  await notifyForumThreadApproved(
    thread.id,
    thread.authorId,
    thread.forumId,
    thread.forum.title,
  );
  await revalidateForumPaths(thread.forumId, thread.id);
}

export async function rejectThreadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const thread = await prisma.forumThread.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  await revalidateForumPaths(thread.forumId, thread.id);
}

export async function approveCommentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const comment = await prisma.forumComment.update({
    where: { id },
    data: { status: "APPROVED" },
    include: { thread: { include: { forum: { select: { title: true } } } } },
  });
  await notifyForumCommentApproved(
    comment.id,
    comment.threadId,
    comment.authorId,
    comment.thread.forumId,
    comment.thread.forum.title,
  );
  await revalidateForumPaths(comment.thread.forumId, comment.threadId);
}

export async function rejectCommentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const comment = await prisma.forumComment.update({
    where: { id },
    data: { status: "REJECTED" },
    include: { thread: true },
  });
  await revalidateForumPaths(comment.thread.forumId, comment.threadId);
}

export async function createForumThreadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const forumId = String(formData.get("forumId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || null;
  const coverUrl = String(formData.get("coverUrl") ?? "").trim() || null;

  if (!forumId || !body) {
    return { ok: false, message: "Napíšte text príspevku." };
  }

  await prisma.forumThread.create({
    data: {
      forumId,
      authorId: admin.id,
      title,
      body,
      coverUrl,
      status: "APPROVED",
    },
  });

  await revalidateForumPaths(forumId);
  return { ok: true, message: "Príspevok bol publikovaný." };
}

export async function deleteForumThreadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const forumId = String(formData.get("forumId") ?? "");
  if (!id) return;
  await prisma.forumThread.delete({ where: { id } });
  if (forumId) await revalidateForumPaths(forumId);
}

export async function deleteForumCommentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const forumId = String(formData.get("forumId") ?? "");
  if (!id) return;
  await prisma.forumComment.delete({ where: { id } });
  if (forumId) await revalidateForumPaths(forumId);
}
