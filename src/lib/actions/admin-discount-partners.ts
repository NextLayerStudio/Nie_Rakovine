"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { DiscountCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { parseDiscountCategory } from "@/lib/discount-category";
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

function revalidateDiscountPaths(handle?: string) {
  revalidatePath("/admin/profiles");
  revalidatePath("/admin/discount-partners");
  revalidatePath("/home");
  revalidatePath("/home/zlavy");
  if (handle) revalidatePath(`/home/zlavy/${handle}`);
}

export async function createDiscountPartnerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const handleRaw = String(formData.get("handle") ?? "").trim();
  const handle = slugify(handleRaw || displayName);
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const category = parseDiscountCategory(String(formData.get("category") ?? ""));
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

  if (!displayName || !handle || !category) {
    return { ok: false, message: "Vyplňte meno, identifikátor a kategóriu." };
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

  const exists = await prisma.discountPartner.findUnique({ where: { handle } });
  if (exists) {
    return { ok: false, message: "Tento identifikátor už existuje." };
  }

  const partner = await prisma.discountPartner.create({
    data: {
      handle,
      displayName,
      bio,
      avatarUrl,
      coverUrl,
      category,
      published,
      featured,
      sortOrder,
    },
  });

  revalidateDiscountPaths(partner.handle);
  redirect(`/admin/discount-partners/${partner.id}`);
}

export async function updateDiscountPartnerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const handleRaw = String(formData.get("handle") ?? "").trim();
  const handle = slugify(handleRaw);
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const category = parseDiscountCategory(String(formData.get("category") ?? ""));
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

  if (!id || !displayName || !handle || !category) {
    return { ok: false, message: "Vyplňte povinné polia." };
  }

  const existing = await prisma.discountPartner.findUnique({ where: { id } });

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

  if (avatarUrl === null && existing?.avatarUrl) avatarUrl = existing.avatarUrl;
  if (coverUrl === null && existing?.coverUrl) coverUrl = existing.coverUrl;

  const conflict = await prisma.discountPartner.findFirst({
    where: { handle, NOT: { id } },
  });
  if (conflict) {
    return { ok: false, message: "Identifikátor je obsadený." };
  }

  const partner = await prisma.discountPartner.update({
    where: { id },
    data: {
      handle,
      displayName,
      bio,
      avatarUrl,
      coverUrl,
      category: category as DiscountCategory,
      published,
      featured,
      sortOrder,
    },
  });

  revalidateDiscountPaths(partner.handle);
  redirect(`/admin/discount-partners/${partner.id}`);
}

export async function toggleDiscountPartnerPublishedAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const current = formData.get("current") === "true";
  if (!id) return;
  await prisma.discountPartner.update({ where: { id }, data: { published: !current } });
  revalidateDiscountPaths();
}

export async function deleteDiscountPartnerAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.discountPartner.delete({ where: { id } });
  revalidateDiscountPaths();
  redirect("/admin/profiles");
}

export async function createDiscountOfferAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const partnerId = String(formData.get("partnerId") ?? "");
  const published = formData.get("published") === "on";
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

  let imageUrl: string | null;
  try {
    imageUrl = await resolveImageField(
      formData,
      "imageFile",
      "imageUrl",
      "profiles",
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať obrázok.",
    };
  }

  if (!partnerId || !imageUrl) {
    return { ok: false, message: "Nahrajte obrázok zľavovej karty." };
  }

  const partner = await prisma.discountPartner.findUniqueOrThrow({
    where: { id: partnerId },
  });

  await prisma.discountOffer.create({
    data: {
      partnerId,
      title: "",
      imageUrl,
      published,
      sortOrder,
    },
  });

  revalidateDiscountPaths(partner.handle);
  redirect(`/admin/discount-partners/${partnerId}`);
}

export async function updateDiscountOfferAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const partnerId = String(formData.get("partnerId") ?? "");
  const published = formData.get("published") === "on";
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

  if (!id || !partnerId) {
    return { ok: false, message: "Chýba identifikátor karty." };
  }

  const existing = await prisma.discountOffer.findUnique({ where: { id } });

  let imageUrl: string | null;
  try {
    imageUrl = await resolveImageField(
      formData,
      "imageFile",
      "imageUrl",
      "profiles",
    );
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať obrázok.",
    };
  }

  if (imageUrl === null && existing?.imageUrl) imageUrl = existing.imageUrl;

  if (!imageUrl) {
    return { ok: false, message: "Nahrajte obrázok zľavovej karty." };
  }

  const partner = await prisma.discountPartner.findUniqueOrThrow({
    where: { id: partnerId },
  });

  await prisma.discountOffer.update({
    where: { id },
    data: {
      imageUrl,
      published,
      sortOrder,
    },
  });

  revalidateDiscountPaths(partner.handle);
  redirect(`/admin/discount-partners/${partnerId}`);
}

export async function deleteDiscountOfferAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const partnerId = String(formData.get("partnerId") ?? "");
  if (!id) return;
  await prisma.discountOffer.delete({ where: { id } });
  const partner = partnerId
    ? await prisma.discountPartner.findUnique({ where: { id: partnerId } })
    : null;
  revalidateDiscountPaths(partner?.handle);
  redirect(partnerId ? `/admin/discount-partners/${partnerId}` : "/admin/profiles");
}

// ------ Reklama posts (discount-partner posts shown in the home feed) -------

export async function createReklamaPostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const partnerId = String(formData.get("partnerId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const linkedOfferId = String(formData.get("linkedOfferId") ?? "").trim() || null;
  const published = formData.get("published") === "on";

  if (!partnerId) {
    return { ok: false, message: "Chýba značka." };
  }

  let coverUrl: string | null;
  try {
    coverUrl = await resolveImageField(formData, "coverFile", "coverUrl", "posts");
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať obrázok.",
    };
  }

  if (!coverUrl) {
    return { ok: false, message: "Nahrajte obrázok reklamy." };
  }

  const partner = await prisma.discountPartner.findUniqueOrThrow({
    where: { id: partnerId },
  });

  await prisma.post.create({
    data: {
      type: "PHOTO",
      title: title || partner.displayName,
      excerpt,
      coverUrl,
      published,
      publishedAt: published ? new Date() : null,
      discountPartnerId: partnerId,
      linkedOfferId,
    },
  });

  revalidateDiscountPaths(partner.handle);
  redirect(`/admin/discount-partners/${partnerId}`);
}

export async function updateReklamaPostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const partnerId = String(formData.get("partnerId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const linkedOfferId = String(formData.get("linkedOfferId") ?? "").trim() || null;
  const published = formData.get("published") === "on";

  if (!id || !partnerId) {
    return { ok: false, message: "Chýba identifikátor." };
  }

  const existing = await prisma.post.findUnique({ where: { id } });

  let coverUrl: string | null;
  try {
    coverUrl = await resolveImageField(formData, "coverFile", "coverUrl", "posts");
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Nepodarilo sa nahrať obrázok.",
    };
  }

  if (coverUrl === null && existing?.coverUrl) coverUrl = existing.coverUrl;
  if (!coverUrl) {
    return { ok: false, message: "Nahrajte obrázok reklamy." };
  }

  const partner = await prisma.discountPartner.findUniqueOrThrow({
    where: { id: partnerId },
  });

  await prisma.post.update({
    where: { id },
    data: {
      title: title || partner.displayName,
      excerpt,
      coverUrl,
      published,
      publishedAt: published ? new Date() : null,
      linkedOfferId,
    },
  });

  revalidateDiscountPaths(partner.handle);
  redirect(`/admin/discount-partners/${partnerId}`);
}

export async function deleteReklamaPostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const partnerId = String(formData.get("partnerId") ?? "");
  if (!id) return;
  await prisma.post.delete({ where: { id } });
  const partner = partnerId
    ? await prisma.discountPartner.findUnique({ where: { id: partnerId } })
    : null;
  revalidateDiscountPaths(partner?.handle);
  redirect(partnerId ? `/admin/discount-partners/${partnerId}` : "/admin/profiles");
}
