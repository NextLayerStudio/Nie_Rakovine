"use server";

import { prisma } from "@/lib/prisma";
import { requireActionUser } from "@/lib/safe-action";

export async function toggleSavedPostAction(
  formData: FormData,
): Promise<{ ok: boolean; saved: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false, saved: false, message: auth.message };

  const postId = String(formData.get("postId") ?? "").trim();
  if (!postId) return { ok: false, saved: false };

  const existing = await prisma.savedPost.findUnique({
    where: { userId_postId: { userId: auth.user.id, postId } },
  });

  if (existing) {
    await prisma.savedPost.delete({ where: { id: existing.id } });
    return { ok: true, saved: false };
  } else {
    await prisma.savedPost.create({
      data: { userId: auth.user.id, postId },
    });
    return { ok: true, saved: true };
  }
}
