"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { prismaActionError, requireActionUser } from "@/lib/safe-action";

/** Like / unlike — kept separate from posts.ts so simple actions don't load sharp. */
export async function togglePostLikeAction(
  formData: FormData,
): Promise<{ ok: boolean; message?: string }> {
  const auth = await requireActionUser();
  if (!auth.ok) return auth;
  const user = auth.user;

  const postId = String(formData.get("postId") ?? "");
  if (!postId) return { ok: false, message: "Chýba príspevok." };

  try {
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

  // Client calls router.refresh() — avoid invalidating the whole app on every tap.
  return { ok: true };
}
