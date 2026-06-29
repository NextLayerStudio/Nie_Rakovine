"use server";

import { prisma } from "@/lib/prisma";
import { requireActionUser, prismaActionError } from "@/lib/safe-action";

export async function addEventCommentAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;

  const eventId = String(formData.get("eventId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!eventId || !body) return { ok: false, message: "Vyplňte komentár." };

  try {
    await prisma.eventComment.create({
      data: { eventId, authorId: auth.user.id, body },
    });
  } catch (err) {
    return { ok: false, message: prismaActionError(err, "Nepodarilo sa pridať komentár.") };
  }

  return { ok: true };
}

export async function fetchEventCommentsAction(
  eventId: string,
): Promise<{ ok: boolean; comments: { id: string; body: string; authorName: string; createdAt: string }[] }> {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false, comments: [] };

  const comments = await prisma.eventComment.findMany({
    where: { eventId },
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
