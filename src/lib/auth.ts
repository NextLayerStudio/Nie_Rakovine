import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "onko_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): Uint8Array {
  // Strip optional quotes from .env values (e.g. AUTH_SECRET="...")
  const raw = process.env.AUTH_SECRET?.trim().replace(/^["']|["']$/g, "");
  if (!raw || raw.length < 16) {
    throw new Error("AUTH_SECRET must be set (>= 16 chars)");
  }
  return new TextEncoder().encode(raw);
}

export type SessionPayload = {
  userId: string;
  role: "USER" | "ADMIN";
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function readSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.userId === "string" &&
      (payload.role === "USER" || payload.role === "ADMIN")
    ) {
      return { userId: payload.userId, role: payload.role };
    }
    return null;
  } catch {
    return null;
  }
}

/** Lightweight user lookup for server actions (no redirect, minimal fields). */
export async function getSessionUserForAction() {
  try {
    const session = await readSession();
    if (!session) return null;
    return await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, fullName: true },
    });
  } catch (err) {
    console.error("[getSessionUserForAction]", err);
    return null;
  }
}

/** One DB round-trip per request (dedupes layout + page + header). */
export const getCurrentUser = cache(async () => {
  const session = await readSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/home");
  return user;
}
