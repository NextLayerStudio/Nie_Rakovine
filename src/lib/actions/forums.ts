"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { prismaActionError, requireActionUser } from "@/lib/safe-action";
import { notifyForumReaction } from "@/lib/notifications";

export type ActionState = { ok: boolean; message?: string };

async function isPublishedForum(forumId: string) {
  const forum = await prisma.forum.findFirst({
    where: { id: forumId, published: true },
    select: { id: true },
  });
  return !!forum;
}

export async function joinForumAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;
  const user = auth.user;

  const forumId = String(formData.get("forumId") ?? "");
  if (!forumId) return { ok: false, message: "Chýba fórum." };

  if (!(await isPublishedForum(forumId))) {
    return { ok: false, message: "Fórum nie je dostupné." };
  }

  try {
    await prisma.forumMembership.upsert({
      where: { forumId_userId: { forumId, userId: user.id } },
      create: { forumId, userId: user.id },
      update: {},
    });
  } catch (err) {
    return {
      ok: false,
      message: prismaActionError(err, "Nepodarilo sa zapojiť do fóra."),
    };
  }

  revalidatePath("/home/forums");
  if (forumId) {
    revalidatePath(`/home/forums/${forumId}`);
  }
  return { ok: true };
}

/** Follow = join the forum; following again leaves it. */
export async function toggleForumFollowAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;
  const user = auth.user;

  const forumId = String(formData.get("forumId") ?? "");
  if (!forumId) return { ok: false, message: "Chýba fórum." };

  try {
    const existing = await prisma.forumMembership.findUnique({
      where: { forumId_userId: { forumId, userId: user.id } },
    });

    if (existing) {
      await prisma.forumMembership.delete({
        where: { forumId_userId: { forumId, userId: user.id } },
      });
    } else {
      if (!(await isPublishedForum(forumId))) {
        return { ok: false, message: "Fórum nie je dostupné." };
      }
      await prisma.forumMembership.create({
        data: { forumId, userId: user.id },
      });
    }
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // already joined
    } else {
      return {
        ok: false,
        message: prismaActionError(err, "Nepodarilo sa zmeniť sledovanie."),
      };
    }
  }

  // Client refresh updates the current forum page.
  return { ok: true };
}

export async function toggleForumThreadLikeAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;
  const user = auth.user;

  const threadId = String(formData.get("threadId") ?? "");
  const forumId = String(formData.get("forumId") ?? "");
  if (!threadId) return { ok: false, message: "Chýba príspevok." };

  try {
    const existing = await prisma.forumThreadLike.findUnique({
      where: { userId_threadId: { userId: user.id, threadId } },
    });

    if (existing) {
      await prisma.forumThreadLike.delete({
        where: { userId_threadId: { userId: user.id, threadId } },
      });
      await prisma.forumThread.update({
        where: { id: threadId },
        data: { likeCount: { decrement: 1 } },
      });
    } else {
      await prisma.forumThreadLike.create({
        data: { userId: user.id, threadId },
      });
      await prisma.forumThread.update({
        where: { id: threadId },
        data: { likeCount: { increment: 1 } },
      });

      const thread = await prisma.forumThread.findUnique({
        where: { id: threadId },
        select: {
          authorId: true,
          forumId: true,
          forum: { select: { title: true } },
        },
      });
      if (thread) {
        await notifyForumReaction({
          authorId: thread.authorId,
          reactorId: user.id,
          reactorName: user.fullName,
          forumId: thread.forumId,
          forumTitle: thread.forum.title,
          threadId,
        });
      }
    }
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // already liked
    } else {
      return {
        ok: false,
        message: prismaActionError(err, "Nepodarilo sa uložiť reakciu."),
      };
    }
  }

  if (forumId) {
    revalidatePath(`/home/forums/${forumId}/${threadId}`);
    revalidatePath(`/home/forums/${forumId}`);
  }

  return { ok: true };
}

export async function toggleForumCommentLikeAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;
  const user = auth.user;

  const commentId = String(formData.get("commentId") ?? "");
  const threadId = String(formData.get("threadId") ?? "");
  const forumId = String(formData.get("forumId") ?? "");
  if (!commentId) return { ok: false, message: "Chýba správa." };

  try {
    const existing = await prisma.forumCommentLike.findUnique({
      where: { userId_commentId: { userId: user.id, commentId } },
    });

    if (existing) {
      await prisma.forumCommentLike.delete({
        where: { userId_commentId: { userId: user.id, commentId } },
      });
      await prisma.forumComment.update({
        where: { id: commentId },
        data: { likeCount: { decrement: 1 } },
      });
    } else {
      await prisma.forumCommentLike.create({
        data: { userId: user.id, commentId },
      });
      await prisma.forumComment.update({
        where: { id: commentId },
        data: { likeCount: { increment: 1 } },
      });

      const comment = await prisma.forumComment.findUnique({
        where: { id: commentId },
        select: {
          authorId: true,
          threadId: true,
          thread: {
            select: {
              forumId: true,
              forum: { select: { title: true } },
            },
          },
        },
      });
      if (comment) {
        await notifyForumReaction({
          authorId: comment.authorId,
          reactorId: user.id,
          reactorName: user.fullName,
          forumId: comment.thread.forumId,
          forumTitle: comment.thread.forum.title,
          threadId: comment.threadId,
          commentId,
        });
      }
    }
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // already liked
    } else {
      return {
        ok: false,
        message: prismaActionError(err, "Nepodarilo sa uložiť reakciu."),
      };
    }
  }

  if (forumId && threadId) {
    revalidatePath(`/home/forums/${forumId}/${threadId}`);
  }

  return { ok: true };
}

export async function createCommentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false, message: auth.message };
  const user = auth.user;

  const threadId = String(formData.get("threadId") ?? "");
  const forumId = String(formData.get("forumId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const replyToCommentId =
    String(formData.get("replyToCommentId") ?? "").trim() || null;

  if (!threadId || !body) {
    return { ok: false, message: "Napíšte komentár." };
  }

  const thread = await prisma.forumThread.findFirst({
    where: {
      id: threadId,
      forumId: forumId || undefined,
      status: "APPROVED",
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

  let replyTarget: {
    authorId: string;
    forumTitle: string;
  } | null = null;

  if (replyToCommentId) {
    const parent = await prisma.forumComment.findFirst({
      where: {
        id: replyToCommentId,
        threadId,
        status: "APPROVED",
      },
      select: {
        authorId: true,
        thread: {
          select: {
            forum: { select: { title: true } },
          },
        },
      },
    });
    if (!parent) {
      return { ok: false, message: "Správa na reakciu nie je dostupná." };
    }
    replyTarget = {
      authorId: parent.authorId,
      forumTitle: parent.thread.forum.title,
    };
  }

  await prisma.forumComment.create({
    data: {
      threadId,
      authorId: user.id,
      body,
      replyToCommentId,
      status: "APPROVED",
    },
  });

  if (replyTarget) {
    await notifyForumReaction({
      authorId: replyTarget.authorId,
      reactorId: user.id,
      reactorName: user.fullName,
      forumId: thread.forumId,
      forumTitle: replyTarget.forumTitle,
      threadId,
      commentId: replyToCommentId,
      reactionText: body,
    });
  }

  revalidatePath(`/home/forums/${forumId}/${threadId}`);
  revalidatePath(`/home/forums/${forumId}`);
  return {
    ok: true,
    message: replyToCommentId ? "Reakcia odoslaná." : "Správa odoslaná.",
  };
}

export async function createThreadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false, message: auth.message };
  const user = auth.user;

  const forumId = String(formData.get("forumId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || null;
  const imageFile = formData.get("image");

  if (!forumId || !body) {
    return { ok: false, message: "Napíšte text príspevku." };
  }

  let coverUrl: string | null = null;
  try {
    const { saveForumImage } = await import("@/lib/forum-image");
    coverUrl = await saveForumImage(
      imageFile instanceof File ? imageFile : null,
    );
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : "Obrázok sa nepodarilo uložiť.",
    };
  }

  let threadId: string;
  try {
    const [forum, membership] = await Promise.all([
      prisma.forum.findFirst({
        where: { id: forumId, published: true },
        select: { id: true },
      }),
      prisma.forumMembership.findUnique({
        where: { forumId_userId: { forumId, userId: user.id } },
      }),
    ]);

    if (!forum) {
      return { ok: false, message: "Fórum nie je dostupné." };
    }
    if (!membership) {
      return { ok: false, message: "Najprv sa zapojte do fóra." };
    }

    const thread = await prisma.forumThread.create({
      data: {
        forumId,
        authorId: user.id,
        title,
        body,
        coverUrl,
        status: "PENDING",
      },
    });
    threadId = thread.id;
  } catch (err) {
    return {
      ok: false,
      message: prismaActionError(err, "Príspevok sa nepodarilo uložiť."),
    };
  }

  revalidatePath("/admin/forums/moderation");
  revalidatePath(`/home/forums/${forumId}`);
  redirect(`/home/forums/${forumId}/${threadId}`);
}

/** A regular user proposes a new forum. It stays hidden until an admin approves it. */
export async function createForumByUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const accentColor =
    String(formData.get("accentColor") ?? "").trim() || "#6F2380";
  const imageFile = formData.get("image");

  if (!title) {
    return { ok: false, message: "Zadajte názov fóra." };
  }

  let imageUrl: string | null = null;
  try {
    const { saveForumImage } = await import("@/lib/forum-image");
    imageUrl = await saveForumImage(
      imageFile instanceof File ? imageFile : null,
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Obrázok sa nepodarilo uložiť.",
    };
  }

  await prisma.forum.create({
    data: {
      title,
      description,
      imageUrl,
      accentColor,
      published: false,
      createdById: user.id,
      members: { create: { userId: user.id } },
    },
  });

  revalidatePath("/admin/forums");
  revalidatePath("/admin/forums/moderation");
  revalidatePath("/home/forums");
  redirect("/home/forums?submitted=1");
}
