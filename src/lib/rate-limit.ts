import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const MAX_ATTEMPTS = 5;
const WINDOW = "15 m";
const WINDOW_MS = 15 * 60 * 1000;

export const RATE_LIMIT_MESSAGE =
  "Príliš veľa pokusov. Skúste to znova o 15 minút.";

export type AuthRateLimitScope = "login" | "register" | "reset-password";

type RateLimitResult =
  | { allowed: true }
  | { allowed: false; message: string };

type MemoryBucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, MemoryBucket>();
const upstashLimiters = new Map<string, Ratelimit>();
let upstashRedis: Redis | null = null;
let warnedMissingUpstash = false;

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function getUpstashCredentials():
  | { url: string; token: string }
  | null {
  const url = readEnv(
    "UPSTASH_REDIS_REST_URL",
    "KV_REST_API_URL",
    "UPSTASH_KV_REST_API_URL",
    "Upstash_KV_REST_API_URL",
  );
  // Use the read/write token — not the read-only token.
  const token = readEnv(
    "UPSTASH_REDIS_REST_TOKEN",
    "KV_REST_API_TOKEN",
    "UPSTASH_KV_REST_API_TOKEN",
    "Upstash_KV_REST_API_TOKEN",
  );

  if (!url || !token) return null;
  return { url, token };
}

function upstashConfigured(): boolean {
  return getUpstashCredentials() !== null;
}

function getUpstashRedis(): Redis {
  if (!upstashRedis) {
    const credentials = getUpstashCredentials();
    if (!credentials) {
      throw new Error("Upstash Redis is not configured");
    }
    upstashRedis = new Redis(credentials);
  }
  return upstashRedis;
}

function getUpstashLimiter(prefix: string): Ratelimit {
  const existing = upstashLimiters.get(prefix);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis: getUpstashRedis(),
    limiter: Ratelimit.slidingWindow(MAX_ATTEMPTS, WINDOW),
    prefix,
    analytics: true,
  });
  upstashLimiters.set(prefix, limiter);
  return limiter;
}

function checkInMemory(key: string): { success: boolean } {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true };
  }

  if (bucket.count >= MAX_ATTEMPTS) {
    return { success: false };
  }

  bucket.count += 1;
  return { success: true };
}

async function checkKey(prefix: string, identifier: string): Promise<boolean> {
  const key = `${prefix}:${identifier}`;

  if (upstashConfigured()) {
    const { success } = await getUpstashLimiter(prefix).limit(key);
    return success;
  }

  if (process.env.NODE_ENV === "production" && !warnedMissingUpstash) {
    warnedMissingUpstash = true;
    console.error(
      "[rate-limit] Upstash Redis env vars missing in production — falling back to in-memory limits (not reliable on serverless).",
    );
  }

  return checkInMemory(key).success;
}

export async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headerStore.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

/** Limit sensitive auth actions by IP and optional e-mail address. */
export async function enforceAuthRateLimit(input: {
  scope: AuthRateLimitScope;
  email?: string;
}): Promise<RateLimitResult> {
  const ip = await getClientIp();
  const email = input.email?.trim().toLowerCase();
  const prefix = `onko:${input.scope}`;

  const checks = [checkKey(`${prefix}:ip`, ip)];
  if (email) {
    checks.push(checkKey(`${prefix}:email`, email));
  }

  const results = await Promise.all(checks);
  if (results.some((success) => !success)) {
    return { allowed: false, message: RATE_LIMIT_MESSAGE };
  }

  return { allowed: true };
}
