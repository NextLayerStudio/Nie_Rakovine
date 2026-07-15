"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { parseCancerTypes } from "@/lib/cancer-type";
import { SUBSCRIPTION_PLANS, SUPPORTER_MIN_AMOUNT_EUR } from "@/lib/constants";
import { redeemDiscountCode, validateDiscountCode } from "@/lib/discount-codes";
import type {
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";

export type ActionState = {
  ok: boolean;
  message?: string;
  redirectTo?: string;
};

function getStringArray(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

// --------------------------------------------------------------------
// Subscription — step 1: pick a plan.
// FREE has no payment step — activate immediately. MONTHLY/YEARLY/
// SUPPORTER move on to checkout (no charge yet at this point).
// --------------------------------------------------------------------
export async function selectSubscriptionPlanAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const plan = String(formData.get("plan") ?? "");
  if (
    plan !== "FREE" &&
    plan !== "MONTHLY" &&
    plan !== "YEARLY" &&
    plan !== "SUPPORTER"
  ) {
    return { ok: false, message: "Vyberte balíček." };
  }

  if (plan === "FREE") {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionPlan: "FREE" satisfies SubscriptionPlan,
        subscriptionStatus: "ACTIVE" satisfies SubscriptionStatus,
        subscriptionStart: new Date(),
        subscriptionEnd: null,
      },
    });
    return { ok: true, redirectTo: "/register/profile/location" };
  }

  return {
    ok: true,
    redirectTo: `/register/subscription/checkout?plan=${plan}`,
  };
}

// --------------------------------------------------------------------
// Subscription — step 2: confirm the recurring-payment consent and
// activate. GoPay is not wired up yet (no merchant contract/credentials),
// so this still just activates the membership directly — but the consent
// checkbox + disclosed parameters here are the real, permanent UI, ready
// for the actual charge call once GoPay is connected.
//
// SUPPORTER is a one-time payment (custom amount, min. SUPPORTER_MIN_AMOUNT_EUR)
// that grants a year of access and skips the rest of the profile-building
// steps — supporters aren't patients, so location/diagnosis/interests/etc.
// don't apply to them.
// --------------------------------------------------------------------
export async function confirmSubscriptionPaymentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const plan = String(formData.get("plan") ?? "") as SubscriptionPlan;
  if (plan !== "MONTHLY" && plan !== "YEARLY" && plan !== "SUPPORTER") {
    return { ok: false, message: "Vyberte balíček." };
  }
  if (formData.get("consent") !== "on") {
    return {
      ok: false,
      message:
        plan === "SUPPORTER"
          ? "Na pokračovanie potrebujeme váš súhlas s platbou."
          : "Na pokračovanie potrebujeme váš súhlas so založením opakovanej platby.",
    };
  }

  const now = new Date();

  if (plan === "SUPPORTER") {
    const amount = Number(formData.get("amount") ?? 0);
    if (!Number.isFinite(amount) || amount < SUPPORTER_MIN_AMOUNT_EUR) {
      return {
        ok: false,
        message: `Minimálna suma podpory je ${SUPPORTER_MIN_AMOUNT_EUR} €.`,
      };
    }

    const end = new Date(now);
    end.setFullYear(end.getFullYear() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionPlan: "SUPPORTER" satisfies SubscriptionPlan,
        subscriptionStatus: "ACTIVE" satisfies SubscriptionStatus,
        subscriptionStart: now,
        subscriptionEnd: end,
      },
    });

    return { ok: true, redirectTo: "/register/profile/done" };
  }

  const planInfo = SUBSCRIPTION_PLANS.find((p) => p.id === plan);
  const discountCodeRaw = String(formData.get("discountCode") ?? "").trim();
  if (discountCodeRaw && planInfo) {
    const result = await redeemDiscountCode(discountCodeRaw, planInfo.priceEuro);
    if (!result.ok) {
      return { ok: false, message: result.message };
    }
  }

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

  return { ok: true, redirectTo: "/register/profile/location" };
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

  return { ok: true, redirectTo: "/register/profile/patient-status" };
}

// --------------------------------------------------------------------
// Profile - step 2: patient status (am I a patient, or not?)
// --------------------------------------------------------------------
export async function savePatientStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const isPatient = String(formData.get("isPatient") ?? "");
  if (isPatient !== "yes" && isPatient !== "no") {
    return { ok: false, message: "Vyberte jednu z možností." };
  }

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, isPatient: isPatient === "yes" },
    update: { isPatient: isPatient === "yes" },
  });

  return {
    ok: true,
    redirectTo:
      isPatient === "yes"
        ? "/register/profile/diagnosis"
        : "/register/profile/interests",
  };
}

// --------------------------------------------------------------------
// Profile - step 3: diagnosis (only reached if the member is a patient)
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

  return { ok: true, redirectTo: "/register/profile/interests" };
}

// --------------------------------------------------------------------
// Profile - step 4: interests
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

  return { ok: true, redirectTo: "/register/profile/expectations" };
}

// --------------------------------------------------------------------
// Profile - step 5: expectations + help
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

  return { ok: true, redirectTo: "/register/profile/source" };
}

// --------------------------------------------------------------------
// Profile - step 6: hear about us
// --------------------------------------------------------------------
export async function saveSourceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const hearAboutUs = getStringArray(formData, "hearAboutUs");

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      hearAboutUs,
    },
    update: {
      hearAboutUs,
    },
  });

  revalidatePath("/profile");
  return { ok: true, redirectTo: "/register/profile/done" };
}

// --------------------------------------------------------------------
// Checkout — preview a discount code's effect before final payment
// confirmation (read-only, does not consume the code).
// --------------------------------------------------------------------
export type DiscountPreviewState = {
  ok: boolean;
  message?: string;
  finalPriceEuro?: number;
  discountLabel?: string;
};

export async function previewDiscountCodeAction(
  _prev: DiscountPreviewState,
  formData: FormData,
): Promise<DiscountPreviewState> {
  await requireUser();
  const code = String(formData.get("discountCode") ?? "");
  const plan = String(formData.get("plan") ?? "");
  const planInfo = SUBSCRIPTION_PLANS.find((p) => p.id === plan);
  if (!planInfo) return { ok: false, message: "Neplatný balíček." };

  const result = await validateDiscountCode(code, planInfo.priceEuro);
  if (!result.ok) return { ok: false, message: result.message };

  return {
    ok: true,
    finalPriceEuro: result.finalPriceEuro,
    discountLabel: result.discountLabel,
  };
}
