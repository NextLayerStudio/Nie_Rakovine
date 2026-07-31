"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { parseCancerTypes } from "@/lib/cancer-type";
import { SUBSCRIPTION_PLANS, SUPPORTER_MIN_AMOUNT_EUR } from "@/lib/constants";
import { redeemDiscountCode, validateDiscountCode } from "@/lib/discount-codes";
import { createHppOrder, generateNexiOrderId, nexiConfigured } from "@/lib/nexi";
import { getAppUrlFromEnv } from "@/lib/email/brand";
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
/** 10-digit numeric variable symbol for bank-transfer reconciliation. */
async function generateUniqueVariableSymbol(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const candidate = String(
      Math.floor(1_000_000_000 + Math.random() * 8_999_999_999),
    );
    const existing = await prisma.user.findUnique({
      where: { paymentVariableSymbol: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  throw new Error("Nepodarilo sa vygenerovať variabilný symbol.");
}

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
  const paymentMethod =
    formData.get("paymentMethod") === "BANK_TRANSFER" ? "BANK_TRANSFER" : "CARD";

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

    if (paymentMethod === "BANK_TRANSFER") {
      const variableSymbol = await generateUniqueVariableSymbol();
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlan: "SUPPORTER" satisfies SubscriptionPlan,
          subscriptionStatus: "PENDING_PAYMENT" satisfies SubscriptionStatus,
          subscriptionStart: now,
          subscriptionEnd: end,
          paymentMethod: "BANK_TRANSFER",
          paymentVariableSymbol: variableSymbol,
          paymentAmountEuro: amount,
        },
      });
      return {
        ok: true,
        redirectTo: `/register/subscription/checkout/prevod?next=${encodeURIComponent("/register/profile/done")}`,
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionPlan: "SUPPORTER" satisfies SubscriptionPlan,
        subscriptionStatus: "ACTIVE" satisfies SubscriptionStatus,
        subscriptionStart: now,
        subscriptionEnd: end,
        paymentMethod: "CARD",
      },
    });

    return { ok: true, redirectTo: "/register/profile/done" };
  }

  const planInfo = SUBSCRIPTION_PLANS.find((p) => p.id === plan);
  let finalAmount = planInfo?.priceEuro ?? 0;
  const discountCodeRaw = String(formData.get("discountCode") ?? "").trim();
  if (discountCodeRaw && planInfo) {
    const result = await redeemDiscountCode(discountCodeRaw, planInfo.priceEuro);
    if (!result.ok) {
      return { ok: false, message: result.message };
    }
    finalAmount = result.finalPriceEuro;
  }

  const end = new Date(now);
  if (plan === "MONTHLY") end.setMonth(end.getMonth() + 1);
  if (plan === "YEARLY") end.setFullYear(end.getFullYear() + 1);

  if (paymentMethod === "BANK_TRANSFER") {
    const variableSymbol = await generateUniqueVariableSymbol();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionPlan: plan,
        subscriptionStatus: "PENDING_PAYMENT" satisfies SubscriptionStatus,
        subscriptionStart: now,
        subscriptionEnd: end,
        paymentMethod: "BANK_TRANSFER",
        paymentVariableSymbol: variableSymbol,
        paymentAmountEuro: finalAmount,
      },
    });
    return {
      ok: true,
      redirectTo: `/register/subscription/checkout/prevod?next=${encodeURIComponent("/register/profile/location")}`,
    };
  }

  if (nexiConfigured()) {
    const orderId = generateNexiOrderId("sub");
    const appUrl = getAppUrlFromEnv();
    const { hostedPage, securityToken } = await createHppOrder({
      orderId,
      amountEuroCents: Math.round(finalAmount * 100),
      description: `ONKO KLUB - ${plan === "MONTHLY" ? "mesačné" : "ročné"} členstvo`,
      customerEmail: user.email,
      resultUrl: `${appUrl}/register/subscription/checkout/nexi-result?orderId=${orderId}`,
      cancelUrl: `${appUrl}/register/subscription/checkout`,
      notificationUrl: `${appUrl}/api/nexi/notification`,
      recurrence: {
        action: "CONTRACT_CREATION",
        contractId: orderId,
        contractType: "MIT_SCHEDULED",
        contractFrequency: plan === "MONTHLY" ? "30" : "365",
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        pendingNexiOrderId: orderId,
        pendingNexiSecurityToken: securityToken,
        pendingNexiPlan: plan,
      },
    });

    return { ok: true, redirectTo: hostedPage };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionPlan: plan,
      subscriptionStatus: "ACTIVE" satisfies SubscriptionStatus,
      subscriptionStart: now,
      subscriptionEnd: end,
      paymentMethod: "CARD",
    },
  });

  return { ok: true, redirectTo: "/register/profile/location" };
}

// --------------------------------------------------------------------
// Profile - step 1: about you (location + patient status + diagnosis).
// Diagnosis fields are only present in the submitted form (and therefore
// only saved) when the member answered "yes" to being a patient - the
// combined screen reveals them inline instead of a separate step.
// --------------------------------------------------------------------
export async function saveAboutYouAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const isPatient = String(formData.get("isPatient") ?? "");
  if (isPatient !== "yes" && isPatient !== "no") {
    return { ok: false, message: "Vyberte, či ste pacient s diagnózou." };
  }

  const region = String(formData.get("region") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const lat = formData.get("latitude");
  const lng = formData.get("longitude");

  const diagnosisFields =
    isPatient === "yes"
      ? {
          diagnosis: String(formData.get("diagnosis") ?? "").trim() || null,
          diagnosisPhase:
            String(formData.get("phase") ?? "").trim() || null,
          diagnosisYear: (() => {
            const yearStr = String(formData.get("year") ?? "").trim();
            return yearStr ? Number(yearStr) : null;
          })(),
          cancerTypes: parseCancerTypes(formData.getAll("cancerTypes")),
        }
      : {};

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      region,
      city,
      latitude: lat ? Number(lat) : null,
      longitude: lng ? Number(lng) : null,
      isPatient: isPatient === "yes",
      ...diagnosisFields,
    },
    update: {
      region,
      city,
      latitude: lat ? Number(lat) : null,
      longitude: lng ? Number(lng) : null,
      isPatient: isPatient === "yes",
      ...diagnosisFields,
    },
  });

  return { ok: true, redirectTo: "/register/profile/interests" };
}

// --------------------------------------------------------------------
// Profile - step 2: interests + expectations + help + how they heard
// about the club + membership/newsletter consent.
// --------------------------------------------------------------------
export async function saveMembershipDetailsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const interests = getStringArray(formData, "interests");
  const expectations = getStringArray(formData, "expectations");
  const help = getStringArray(formData, "help");
  const hearAboutUs = getStringArray(formData, "hearAboutUs");
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
      interests,
      expectations: [...expectations, ...help.map((h) => `pomoc: ${h}`)],
      hearAboutUs,
      consentMembership,
      consentNewsletter,
    },
    update: {
      interests,
      expectations: [...expectations, ...help.map((h) => `pomoc: ${h}`)],
      hearAboutUs,
      consentMembership,
      consentNewsletter,
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
