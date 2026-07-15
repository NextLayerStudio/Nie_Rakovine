// Carries the plan (and, for Supporter, the chosen amount) chosen on a public
// marketing page (e.g. /cennik) through account creation + email verification
// into the /register/subscription step — sessionStorage rather than a cookie
// because it's only ever read/written from client components.
export const PRESELECTED_PLAN_KEY = "onko_preselected_plan";
export const PRESELECTED_AMOUNT_KEY = "onko_preselected_amount";

const PLAN_ALIASES: Record<string, string> = {
  free: "FREE",
  monthly: "MONTHLY",
  annual: "YEARLY",
  yearly: "YEARLY",
  supporter: "SUPPORTER",
};

export function normalizePlanParam(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return PLAN_ALIASES[raw.toLowerCase()] ?? null;
}
