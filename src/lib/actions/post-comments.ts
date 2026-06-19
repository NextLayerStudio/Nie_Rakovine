"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionUser, prismaActionError } from "@/lib/safe-action";

export async function addPostCommentAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;

  const postId = String(formData.get("postId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!postId || !body) return { ok: false, message: "Vyplňte komentár." };

  try {
    await prisma.postComment.create({
      data: { postId, authorId: auth.user.id, body },
    });
  } catch (err) {
    return { ok: false, message: prismaActionError(err, "Nepodarilo sa pridať komentár.") };
  }

  revalidatePath("/home");
  return { ok: true };
}

export async function fetchPostCommentsAction(
  postId: string,
): Promise<{ ok: boolean; comments: { id: string; body: string; authorName: string; createdAt: string }[] }> {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false, comments: [] };

  const comments = await prisma.postComment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    take: 50,
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: { select: { fullName: true } },
    },
  });

  return {
    ok: true,
    comments: comments.map((c) => ({
      id: c.id,
      body: c.body,
      authorName: c.author.fullName,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}
