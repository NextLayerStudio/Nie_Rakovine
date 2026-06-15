import "server-only";

import type { CancerType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CANCER_TYPES, cancerTypeShort } from "@/lib/cancer-type";
import {
  GAIN_OPTIONS,
  HEAR_ABOUT_US_OPTIONS,
  HELP_OPTIONS,
  INTEREST_OPTIONS,
} from "@/lib/constants";
import { splitProfileExpectations } from "@/lib/user-profile-display";

export type StatsPeriod = "all" | "7d" | "30d" | "90d";

export type StatsFilters = {
  cancerType?: CancerType | null;
  region?: string | null;
  plan?: "MONTHLY" | "YEARLY" | "NONE" | null;
  period?: StatsPeriod;
};

export type DistributionRow = { label: string; count: number; pct: number };

export type RegistrationStats = {
  totalUsers: number;
  filteredUsers: number;
  completedProfiles: number;
  withDiagnosis: number;
  newsletterOptIn: number;
  activeSubscriptions: number;
  completionRate: number;
  distributions: {
    cancerTypes: DistributionRow[];
    interests: DistributionRow[];
    expectations: DistributionRow[];
    help: DistributionRow[];
    gain: DistributionRow[];
    hearAboutUs: DistributionRow[];
    plans: DistributionRow[];
    diagnosisPhase: DistributionRow[];
    regions: DistributionRow[];
  };
  regionsAvailable: string[];
};

function periodStart(period: StatsPeriod | undefined): Date | null {
  if (!period || period === "all") return null;
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/**
 * Build a distribution table from a known set of option labels plus any
 * extra free-text answers, sorted by count (desc).
 */
function tally(
  values: string[][],
  knownOptions: string[],
  total: number,
): DistributionRow[] {
  const counts = new Map<string, number>();
  for (const opt of knownOptions) counts.set(opt, 0);
  for (const arr of values) {
    for (const raw of arr) {
      const v = raw.trim();
      if (!v) continue;
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getRegistrationStats(
  filters: StatsFilters,
): Promise<RegistrationStats> {
  const start = periodStart(filters.period);

  const where: Prisma.UserWhereInput = {
    role: "USER",
    ...(start ? { createdAt: { gte: start } } : {}),
    ...(filters.plan
      ? { subscriptionPlan: filters.plan }
      : {}),
    ...(filters.cancerType || filters.region
      ? {
          profile: {
            is: {
              ...(filters.cancerType
                ? { cancerTypes: { has: filters.cancerType } }
                : {}),
              ...(filters.region ? { region: filters.region } : {}),
            },
          },
        }
      : {}),
  };

  const [totalUsers, users, regionGroups] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.findMany({
      where,
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        profile: {
          select: {
            diagnosis: true,
            diagnosisPhase: true,
            cancerTypes: true,
            interests: true,
            expectations: true,
            hearAboutUs: true,
            region: true,
            consentNewsletter: true,
          },
        },
      },
    }),
    prisma.userProfile.findMany({
      where: { region: { not: null } },
      select: { region: true },
      distinct: ["region"],
      orderBy: { region: "asc" },
    }),
  ]);

  const filteredUsers = users.length;
  const profiles = users.map((u) => u.profile).filter((p) => p !== null);

  const completedProfiles = profiles.filter(
    (p) =>
      p.cancerTypes.length > 0 ||
      !!p.diagnosis ||
      p.interests.length > 0 ||
      p.expectations.length > 0,
  ).length;
  const withDiagnosis = profiles.filter((p) => !!p.diagnosis).length;
  const newsletterOptIn = profiles.filter((p) => p.consentNewsletter).length;
  const activeSubscriptions = users.filter(
    (u) => u.subscriptionStatus === "ACTIVE",
  ).length;

  // Cancer types distribution
  const cancerCounts = new Map<CancerType, number>();
  for (const t of CANCER_TYPES) cancerCounts.set(t, 0);
  for (const p of profiles) {
    for (const t of p.cancerTypes) {
      cancerCounts.set(t, (cancerCounts.get(t) ?? 0) + 1);
    }
  }
  const cancerTypes: DistributionRow[] = [...cancerCounts.entries()]
    .map(([t, count]) => ({
      label: cancerTypeShort(t),
      count,
      pct: filteredUsers > 0 ? Math.round((count / filteredUsers) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Expectations split into general / help / gain
  const generalArrays: string[][] = [];
  const helpArrays: string[][] = [];
  const gainArrays: string[][] = [];
  for (const p of profiles) {
    const split = splitProfileExpectations(p.expectations);
    generalArrays.push(split.general);
    helpArrays.push(split.help);
    gainArrays.push(split.gain);
  }

  // Diagnosis phase
  const phaseCounts = new Map<string, number>();
  for (const p of profiles) {
    const phase = p.diagnosisPhase?.trim();
    if (phase) phaseCounts.set(phase, (phaseCounts.get(phase) ?? 0) + 1);
  }
  const diagnosisPhase: DistributionRow[] = [...phaseCounts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      pct: filteredUsers > 0 ? Math.round((count / filteredUsers) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Regions
  const regionCounts = new Map<string, number>();
  for (const p of profiles) {
    const r = p.region?.trim();
    if (r) regionCounts.set(r, (regionCounts.get(r) ?? 0) + 1);
  }
  const regions: DistributionRow[] = [...regionCounts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      pct: filteredUsers > 0 ? Math.round((count / filteredUsers) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Subscription plans
  const planLabels: Record<string, string> = {
    YEARLY: "Ročné",
    MONTHLY: "Mesačné",
    NONE: "Žiadne",
  };
  const planCounts = new Map<string, number>([
    ["Ročné", 0],
    ["Mesačné", 0],
    ["Žiadne", 0],
  ]);
  for (const u of users) {
    const label = planLabels[u.subscriptionPlan] ?? "Žiadne";
    planCounts.set(label, (planCounts.get(label) ?? 0) + 1);
  }
  const plans: DistributionRow[] = [...planCounts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      pct: filteredUsers > 0 ? Math.round((count / filteredUsers) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalUsers,
    filteredUsers,
    completedProfiles,
    withDiagnosis,
    newsletterOptIn,
    activeSubscriptions,
    completionRate:
      filteredUsers > 0
        ? Math.round((completedProfiles / filteredUsers) * 100)
        : 0,
    distributions: {
      cancerTypes,
      interests: tally(
        profiles.map((p) => p.interests),
        INTEREST_OPTIONS,
        filteredUsers,
      ),
      expectations: tally(generalArrays, [], filteredUsers),
      help: tally(helpArrays, HELP_OPTIONS, filteredUsers),
      gain: tally(gainArrays, GAIN_OPTIONS, filteredUsers),
      hearAboutUs: tally(
        profiles.map((p) => p.hearAboutUs),
        HEAR_ABOUT_US_OPTIONS,
        filteredUsers,
      ),
      plans,
      diagnosisPhase,
      regions,
    },
    regionsAvailable: regionGroups
      .map((g) => g.region)
      .filter((r): r is string => !!r),
  };
}
