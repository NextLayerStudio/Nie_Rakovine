import "server-only";

import crypto from "crypto";

/** Cryptographically-random numeric code (e.g. "042917") for email verification. */
export function generateNumericCode(length = 6): string {
  const max = 10 ** length;
  return crypto.randomInt(0, max).toString().padStart(length, "0");
}

/** High-entropy URL-safe token (hex) for password-reset links. */
export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/** Store only the hash of a code/token so a DB leak can't reveal live secrets. */
export function hashToken(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
