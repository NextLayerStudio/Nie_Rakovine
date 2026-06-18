"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { prismaActionError, requireActionUser } from "@/lib/safe-action";
import { saveForumImage } from "@/lib/forum-image";

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
  revalidatePath(`/home/forums/${forumId}`);
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

  revalidatePath("/home/forums");
  revalidatePath(`/home/forums/${forumId}`);
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

  revalidatePath("/home/forums");
  if (forumId) {
    revalidatePath(`/home/forums/${forumId}`);
    revalidatePath(`/home/forums/${forumId}/${threadId}`);
  }
  return { ok: true };
}

export async function createThreadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const forumId = String(formData.get("forumId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || null;
  const imageFile = formData.get("image");

  if (!forumId || !body) {
    return { ok: false, message: "Napíšte text príspevku." };
  }

  let coverUrl: string | null = null;
  try {
    coverUrl = await saveForumImage(
      imageFile instanceof File ? imageFile : null,
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Obrázok sa nepodarilo uložiť.",
    };
  }

  // Only published (admin-approved) forums accept posts.
  const forum = await prisma.forum.findFirst({
    where: { id: forumId, published: true },
    select: { id: true },
  });
  if (!forum) {
    return { ok: false, message: "Fórum nie je dostupné." };
  }

  const membership = await prisma.forumMembership.findUnique({
    where: { forumId_userId: { forumId, userId: user.id } },
  });
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

  revalidatePath("/admin/forums/moderation");
  revalidatePath(`/home/forums/${forumId}`);
  redirect(`/home/forums/${forumId}/${thread.id}`);
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
    imageUrl = await saveForumImage(
      imageFile instanceof File ? imageFile : null,
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Obrázok sa nepodarilo uložiť.",
    };
  }

  // User-created forums: published=false + createdById set → admin must approve.
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

  await prisma.forumComment.create({
    data: {
      threadId,
      authorId: user.id,
      body,
      status: "APPROVED",
    },
  });

  revalidatePath(`/home/forums/${forumId}/${threadId}`);
  revalidatePath(`/home/forums/${forumId}`);
  return { ok: true, message: "Správa odoslaná." };
}
