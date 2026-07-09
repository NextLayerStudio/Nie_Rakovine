"use server";

import { cookies } from "next/headers";
import { enforceAuthRateLimit } from "@/lib/rate-limit";

export type StaffAccessState = {
  ok: boolean;
  message?: string;
  redirectTo?: string;
};

const STAFF_BYPASS_COOKIE = "onko_staff_access";

// Verifies the human-facing site password (STAFF_PASSWORD). On success it
// mints the same STAFF_BYPASS_TOKEN cookie the middleware checks — the
// token itself never reaches the browser as a URL/query param.
export async function verifyStaffAccessAction(
  _prev: StaffAccessState,
  formData: FormData,
): Promise<StaffAccessState> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const rateLimit = await enforceAuthRateLimit({ scope: "site-access" });
  if (!rateLimit.allowed) {
    return { ok: false, message: rateLimit.message };
  }

  const expected = process.env.STAFF_PASSWORD?.trim();
  const bypassSecret = process.env.STAFF_BYPASS_TOKEN?.trim();

  if (!expected || !bypassSecret || password !== expected) {
    return { ok: false, message: "Nesprávne heslo." };
  }

  const cookieStore = await cookies();
  cookieStore.set(STAFF_BYPASS_COOKIE, bypassSecret, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return { ok: true, redirectTo: next.startsWith("/") ? next : "/" };
}
