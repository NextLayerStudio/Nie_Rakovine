"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export type ActionState = { ok: boolean; message?: string };

export async function joinForumAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const forumId = String(formData.get("forumId") ?? "");
  if (!forumId) return;

  await prisma.forumMembership.upsert({
    where: { forumId_userId: { forumId, userId: user.id } },
    create: { forumId, userId: user.id },
    update: {},
  });

  revalidatePath("/home/forums");
  revalidatePath(`/home/forums/${forumId}`);
}

export async function createThreadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const forumId = String(formData.get("forumId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || null;

  if (!forumId || !body) {
    return { ok: false, message: "Napíšte text príspevku." };
  }

  const thread = await prisma.forumThread.create({
    data: {
      forumId,
      authorId: user.id,
      title,
      body,
    },
  });

  revalidatePath(`/home/forums/${forumId}`);
  redirect(`/home/forums/${forumId}/${thread.id}`);
}

export async function createCommentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const threadId = String(formData.get("threadId") ?? "");
  const forumId = String(formData.get("forumId") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!threadId || !body) {
    return { ok: false, message: "Napíšte komentár." };
  }

  await prisma.forumComment.create({
    data: {
      threadId,
      authorId: user.id,
      body,
    },
  });

  revalidatePath(`/home/forums/${forumId}/${threadId}`);
  return { ok: true };
}
