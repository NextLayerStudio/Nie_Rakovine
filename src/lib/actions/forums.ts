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

/** Follow = join the forum; following again leaves it. */
export async function toggleForumFollowAction(
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const forumId = String(formData.get("forumId") ?? "");
  if (!forumId) return;

  const existing = await prisma.forumMembership.findUnique({
    where: { forumId_userId: { forumId, userId: user.id } },
  });

  if (existing) {
    await prisma.forumMembership.delete({
      where: { forumId_userId: { forumId, userId: user.id } },
    });
  } else {
    await prisma.forumMembership.create({
      data: { forumId, userId: user.id },
    });
  }

  revalidatePath("/home/forums");
  revalidatePath(`/home/forums/${forumId}`);
}

export async function toggleForumThreadLikeAction(
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const threadId = String(formData.get("threadId") ?? "");
  const forumId = String(formData.get("forumId") ?? "");
  if (!threadId) return;

  const existing = await prisma.forumThreadLike.findUnique({
    where: { userId_threadId: { userId: user.id, threadId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.forumThreadLike.delete({
        where: { userId_threadId: { userId: user.id, threadId } },
      }),
      prisma.forumThread.update({
        where: { id: threadId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.forumThreadLike.create({
        data: { userId: user.id, threadId },
      }),
      prisma.forumThread.update({
        where: { id: threadId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
  }

  revalidatePath("/home/forums");
  if (forumId) {
    revalidatePath(`/home/forums/${forumId}`);
    revalidatePath(`/home/forums/${forumId}/${threadId}`);
  }
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

  const membership = await prisma.forumMembership.findUnique({
    where: { forumId_userId: { forumId, userId: user.id } },
  });
  if (!membership) {
    return { ok: false, message: "Najprv sa zapojte do fóra." };
  }

  await prisma.forumThread.create({
    data: {
      forumId,
      authorId: user.id,
      title,
      body,
      status: "PENDING",
    },
  });

  revalidatePath("/admin/forums/moderation");
  revalidatePath(`/home/forums/${forumId}`);
  redirect(`/home/forums/${forumId}?pending=1`);
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

  const thread = await prisma.forumThread.findFirst({
    where: {
      id: threadId,
      forumId: forumId || undefined,
      OR: [
        { status: "APPROVED" },
        { status: "PENDING", authorId: user.id },
      ],
      NOT: { status: "REJECTED" },
    },
    select: { id: true, forumId: true },
  });
  if (!thread) {
    return { ok: false, message: "Príspevok nie je dostupný." };
  }

  const membership = await prisma.forumMembership.findUnique({
    where: {
      forumId_userId: { forumId: thread.forumId, userId: user.id },
    },
  });
  if (!membership) {
    return { ok: false, message: "Najprv sa zapojte do fóra." };
  }

  await prisma.forumComment.create({
    data: {
      threadId,
      authorId: user.id,
      body,
      status: "PENDING",
    },
  });

  revalidatePath("/admin/forums/moderation");
  revalidatePath(`/home/forums/${forumId}/${threadId}`);
  return {
    ok: true,
    message:
      "Správa odoslaná. Čaká na overenie administrátorom — po schválení sa zobrazí ostatným.",
  };
}
