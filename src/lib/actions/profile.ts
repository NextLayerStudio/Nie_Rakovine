"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { parseCancerTypes } from "@/lib/cancer-type";
import type {
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";

export type ActionState = { ok: boolean; message?: string };

function getStringArray(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

// --------------------------------------------------------------------
// Subscription
// --------------------------------------------------------------------
export async function chooseSubscriptionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const plan = String(formData.get("plan") ?? "") as SubscriptionPlan;
  if (plan !== "MONTHLY" && plan !== "YEARLY") {
    return { ok: false, message: "Vyberte balíček." };
  }

  const now = new Date();
  const end = new Date(now);
  if (plan === "MONTHLY") end.setMonth(end.getMonth() + 1);
  if (plan === "YEARLY") end.setFullYear(end.getFullYear() + 1);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionPlan: plan,
      subscriptionStatus: "ACTIVE" satisfies SubscriptionStatus,
      subscriptionStart: now,
      subscriptionEnd: end,
    },
  });

  redirect("/register/profile/location");
}

// --------------------------------------------------------------------
// Profile - step 1: location
// --------------------------------------------------------------------
export async function saveLocationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const region = String(formData.get("region") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const lat = formData.get("latitude");
  const lng = formData.get("longitude");

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      region,
      city,
      latitude: lat ? Number(lat) : null,
      longitude: lng ? Number(lng) : null,
    },
    update: {
      region,
      city,
      latitude: lat ? Number(lat) : null,
      longitude: lng ? Number(lng) : null,
    },
  });

  redirect("/register/profile/diagnosis");
}

// --------------------------------------------------------------------
// Profile - step 2: diagnosis
// --------------------------------------------------------------------
export async function saveDiagnosisAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const diagnosis =
    String(formData.get("diagnosis") ?? "").trim() || null;
  const phase = String(formData.get("phase") ?? "").trim() || null;
  const yearStr = String(formData.get("year") ?? "").trim();
  const year = yearStr ? Number(yearStr) : null;
  const cancerTypes = parseCancerTypes(formData.getAll("cancerTypes"));

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      diagnosis,
      diagnosisPhase: phase,
      diagnosisYear: year,
      cancerTypes,
    },
    update: {
      diagnosis,
      diagnosisPhase: phase,
      diagnosisYear: year,
      cancerTypes,
    },
  });

  redirect("/register/profile/interests");
}

// --------------------------------------------------------------------
// Profile - step 3: interests
// --------------------------------------------------------------------
export async function saveInterestsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const interests = getStringArray(formData, "interests");

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, interests },
    update: { interests },
  });

  redirect("/register/profile/expectations");
}

// --------------------------------------------------------------------
// Profile - step 4: expectations + help
// --------------------------------------------------------------------
export async function saveExpectationsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const expectations = getStringArray(formData, "expectations");
  const help = getStringArray(formData, "help");
  const consentMembership = formData.get("consentMembership") === "on";
  const consentNewsletter = formData.get("consentNewsletter") === "on";

  if (!consentMembership) {
    return {
      ok: false,
      message:
        "Pre pokračovanie je potrebný súhlas so spracovaním osobných údajov (členstvo).",
    };
  }

  // 'help' is stored under expectations array for now (separate label)
  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      expectations: [...expectations, ...help.map((h) => `pomoc: ${h}`)],
      consentMembership,
      consentNewsletter,
    },
    update: {
      expectations: [...expectations, ...help.map((h) => `pomoc: ${h}`)],
      consentMembership,
      consentNewsletter,
    },
  });

  redirect("/register/profile/source");
}

// --------------------------------------------------------------------
// Profile - step 5: gain (what they expect from us) + hear about us
// --------------------------------------------------------------------
export async function saveSourceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const gain = getStringArray(formData, "gain");
  const hearAboutUs = getStringArray(formData, "hearAboutUs");

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      hearAboutUs,
      // store "gain" alongside expectations with a tag prefix
      expectations: gain.map((g) => `získať: ${g}`),
    },
    update: {
      hearAboutUs,
      expectations: { push: gain.map((g) => `získať: ${g}`) },
    },
  });

  revalidatePath("/profile");
  redirect("/register/profile/done");
}
