"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { enforceAuthRateLimit } from "@/lib/rate-limit";

const GATE_COOKIE_NAME = "onko_site_gate";
const GATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 60; // 60 dní

export type GateActionState = { ok: boolean; message?: string };

export async function unlockGateAction(
  _prev: GateActionState,
  formData: FormData,
): Promise<GateActionState> {
  const rateLimit = await enforceAuthRateLimit({ scope: "site-access" });
  if (!rateLimit.allowed) {
    return { ok: false, message: rateLimit.message };
  }

  const password = String(formData.get("password") ?? "");
  const expected = process.env.SITE_GATE_PASSWORD?.trim();

  if (!expected || password !== expected) {
    return { ok: false, message: "Nesprávne heslo." };
  }

  const jar = await cookies();
  jar.set(GATE_COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GATE_COOKIE_MAX_AGE,
  });

  const nextRaw = String(formData.get("next") ?? "/");
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/";
  redirect(next);
}
