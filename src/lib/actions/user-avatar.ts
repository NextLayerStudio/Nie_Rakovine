"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionUser, prismaActionError } from "@/lib/safe-action";
import { saveUploadedImage } from "@/lib/uploads";

export type AvatarActionState = {
  ok: boolean;
  message?: string;
  avatarUrl?: string;
};

/** @deprecated Prefer POST /api/user/avatar for file uploads. */
export async function uploadUserAvatarAction(
  _prev: AvatarActionState,
  formData: FormData,
): Promise<AvatarActionState> {
  try {
    const auth = await requireActionUser();
    if (!auth.ok) return auth;

    const file = formData.get("avatar");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, message: "Vyberte fotografiu." };
    }

    if (!file.type.startsWith("image/")) {
      return { ok: false, message: "Vyberte obrázok (JPG, PNG, WebP…)." };
    }

    const avatarUrl = await saveUploadedImage(file, "profiles");

    await prisma.userProfile.upsert({
      where: { userId: auth.user.id },
      create: {
        userId: auth.user.id,
        avatarUrl,
      },
      update: { avatarUrl },
    });

    revalidatePath("/profile");
    revalidatePath("/menu/zlavova-karta");
    revalidatePath("/home");

    return { ok: true, avatarUrl };
  } catch (err) {
    console.error("[uploadUserAvatarAction]", err);
    return {
      ok: false,
      message: prismaActionError(
        err,
        err instanceof Error ? err.message : "Nepodarilo sa nahrať fotografiu.",
      ),
    };
  }
}
