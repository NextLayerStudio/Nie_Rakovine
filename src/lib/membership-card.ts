import {
  subscriptionPlanLabel,
  subscriptionStatusLabel,
} from "@/lib/user-profile-display";

export function buildQrPattern(seed: string): boolean[] {
  const out: boolean[] = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < 81; i++) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    out.push(
      (hash & 1) === 1 ||
        i % 9 === 0 ||
        i % 9 === 8 ||
        Math.floor(i / 9) % 9 === 0,
    );
  }
  return out;
}

export function nameInitials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export type MembershipSubscriptionInfo = {
  active: boolean;
  label: string;
  planLabel: string;
  statusLabel: string;
};

export function membershipSubscriptionInfo(user: {
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionEnd?: Date | null;
}): MembershipSubscriptionInfo {
  const now = new Date();
  const hasPlan =
    user.subscriptionPlan === "MONTHLY" || user.subscriptionPlan === "YEARLY";
  const notExpired = !user.subscriptionEnd || user.subscriptionEnd > now;
  const active =
    user.subscriptionStatus === "ACTIVE" && hasPlan && notExpired;

  const planLabel = subscriptionPlanLabel(user.subscriptionPlan);
  const statusLabel = subscriptionStatusLabel(user.subscriptionStatus);

  if (!active) {
    return {
      active: false,
      label: "Neaktívne predplatné",
      planLabel,
      statusLabel,
    };
  }

  if (user.subscriptionPlan === "MONTHLY") {
    return {
      active: true,
      label: "Mesačné predplatné · aktívne",
      planLabel,
      statusLabel,
    };
  }

  return {
    active: true,
    label: "Ročné predplatné · aktívne",
    planLabel,
    statusLabel,
  };
}
