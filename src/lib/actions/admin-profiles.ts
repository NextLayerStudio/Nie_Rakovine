"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { parseCancerTypes } from "@/lib/cancer-type";
import { resolveImageField } from "@/lib/uploads";

export type ActionState = { ok: boolean; message?: string };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function createClubProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const handleRaw = String(formData.get("handle") ?? "").trim();
  const handle = slugify(handleRaw || displayName);
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const cancerTypes = parseCancerTypes(formData.getAll("cancerTypes"));

  if (!displayName || !handle) {
    return { ok: false, message: "Zadajte meno a identifikátor profilu." };
  }

  let avatarUrl: string | null;
  let coverUrl: string | null;
  try {
    avatarUrl = await resolveImageField(
      formData,
      "avatarFile",
      "avatarUrl",
      "profiles",
    );
    coverUrl = await resolveImageField(
      formData,
      "coverFile",
      "coverUrl",
      "profiles",
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať obrázok.",
    };
  }

  const exists = await prisma.clubProfile.findUnique({ where: { handle } });
  if (exists) {
    return { ok: false, message: "Tento identifikátor už existuje." };
  }

  await prisma.clubProfile.create({
    data: { handle, displayName, bio, avatarUrl, coverUrl, published, cancerTypes },
  });

  revalidatePath("/admin/profiles");
  revalidatePath("/home/profiles");
  redirect("/admin/profiles");
}

export async function updateClubProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const handleRaw = String(formData.get("handle") ?? "").trim();
  const handle = slugify(handleRaw);
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const cancerTypes = parseCancerTypes(formData.getAll("cancerTypes"));

  if (!id || !displayName || !handle) {
    return { ok: false, message: "Vyplňte povinné polia." };
  }

  const existing = await prisma.clubProfile.findUnique({ where: { id } });

  let avatarUrl: string | null;
  let coverUrl: string | null;
  try {
    avatarUrl = await resolveImageField(
      formData,
      "avatarFile",
      "avatarUrl",
      "profiles",
    );
    coverUrl = await resolveImageField(
      formData,
      "coverFile",
      "coverUrl",
      "profiles",
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať obrázok.",
    };
  }

  if (avatarUrl === null && existing?.avatarUrl) {
    avatarUrl = existing.avatarUrl;
  }
  if (coverUrl === null && existing?.coverUrl) {
    coverUrl = existing.coverUrl;
  }

  const conflict = await prisma.clubProfile.findFirst({
    where: { handle, NOT: { id } },
  });
  if (conflict) {
    return { ok: false, message: "Identifikátor je obsadený." };
  }

  await prisma.clubProfile.update({
    where: { id },
    data: { handle, displayName, bio, avatarUrl, coverUrl, published, cancerTypes },
  });

  revalidatePath("/admin/profiles");
  revalidatePath(`/admin/profiles/${id}`);
  revalidatePath(`/admin/profiles/${id}/edit`);
  revalidatePath("/home/profiles");
  revalidatePath(`/home/profiles/${handle}`);
  redirect(`/admin/profiles/${id}`);
}

export async function deleteClubProfileAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.clubProfile.delete({ where: { id } });
  revalidatePath("/admin/profiles");
  revalidatePath("/home/profiles");
  redirect("/admin/profiles");
}
