"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireActionUser, prismaActionError } from "@/lib/safe-action";
import { getRecentMoodAverage, getTodayMoodEntry } from "@/lib/mood";
import { isMoodScore } from "@/lib/mood-options";

export type MoodActionState = {
  ok: boolean;
  message?: string;
};

export async function submitMoodEntryAction(
  _prev: MoodActionState,
  formData: FormData,
): Promise<MoodActionState> {
  try {
    const auth = await requireActionUser();
    if (!auth.ok) return auth;

    const score = Number(formData.get("score"));
    if (!isMoodScore(score)) {
      return { ok: false, message: "Vyberte, ako sa cítite." };
    }
    const note = String(formData.get("note") ?? "").trim().slice(0, 500) || null;

    const already = await getTodayMoodEntry(auth.user.id);
    if (already) {
      return { ok: false, message: "Dnešnú náladu ste už zaznamenali." };
    }

    await prisma.moodEntry.create({
      data: { userId: auth.user.id, score, note },
    });

    revalidatePath("/home");
    revalidatePath("/home/profile");

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: prismaActionError(err, "Nepodarilo sa uložiť náladu."),
    };
  }
}

/** Drives the feed support banner — only a boolean crosses the wire, never raw scores. */
export async function getMoodBannerStatusAction(): Promise<
  { ok: true; show: boolean } | { ok: false }
> {
  const auth = await requireActionUser();
  if (!auth.ok) return { ok: false };

  const avg = await getRecentMoodAverage(auth.user.id, 3);
  return { ok: true, show: avg !== null && avg <= 2 };
}
