import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { prismaActionError } from "@/lib/safe-action";
import { saveUploadedImage } from "@/lib/uploads";
import { isLikelyImageFile } from "@/lib/image-upload-limits";

export async function POST(request: Request) {
  try {
    const session = await readSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Prihláste sa prosím znova." },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { ok: false, message: "Vyberte fotografiu." },
        { status: 400 },
      );
    }

    if (!isLikelyImageFile(file)) {
      return NextResponse.json(
        { ok: false, message: "Vyberte obrázok (JPG, PNG, WebP…)." },
        { status: 400 },
      );
    }

    const avatarUrl = await saveUploadedImage(file, "profiles");

    await prisma.userProfile.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        avatarUrl,
      },
      update: { avatarUrl },
    });

    revalidatePath("/profile");
    revalidatePath("/menu");
    revalidatePath("/menu/nastavenia");
    revalidatePath("/menu/zlavova-karta");
    revalidatePath("/home");

    return NextResponse.json({ ok: true, avatarUrl });
  } catch (err) {
    console.error("[POST /api/user/avatar]", err);
    return NextResponse.json(
      {
        ok: false,
        message: prismaActionError(
          err,
          err instanceof Error ? err.message : "Nepodarilo sa nahrať fotografiu.",
        ),
      },
      { status: 500 },
    );
  }
}
