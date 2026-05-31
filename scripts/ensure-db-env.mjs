/**
 * Ensures DATABASE_URL_UNPOOLED exists before any Prisma CLI command.
 * Vercel/Neon often only inject DATABASE_URL (pooled) — Prisma schema needs
 * directUrl for migrate deploy.
 *
 * Resolution order:
 *   1. DATABASE_URL_UNPOOLED (explicit)
 *   2. DIRECT_URL (Vercel Postgres / some Neon templates)
 *   3. POSTGRES_URL_NON_POOLING (Neon + Vercel integration)
 *   4. Derive from DATABASE_URL (strip "-pooler" from hostname)
 *
 * Writes DATABASE_URL_UNPOOLED into .env so Prisma CLI picks it up on Vercel.
 */
import fs from "node:fs";
import path from "node:path";

function trimQuotes(v) {
  return v?.trim().replace(/^["']|["']$/g, "") ?? "";
}

function deriveFromPooled(pooled) {
  const raw = trimQuotes(pooled);
  if (!raw) return null;
  try {
    const normalized = raw.replace(/^postgresql:/, "postgres:");
    const url = new URL(normalized);
    if (url.hostname.includes("-pooler")) {
      url.hostname = url.hostname.replace("-pooler", "");
    }
    url.searchParams.delete("channel_binding");
    url.searchParams.delete("pgbouncer");
    return url.toString().replace(/^postgres:/, "postgresql:");
  } catch {
    return raw.replace("-pooler", "");
  }
}

function resolveUnpooledUrl() {
  const explicit = trimQuotes(process.env.DATABASE_URL_UNPOOLED);
  if (explicit) return explicit;

  for (const key of ["DIRECT_URL", "POSTGRES_URL_NON_POOLING"]) {
    const v = trimQuotes(process.env[key]);
    if (v) return v;
  }

  return deriveFromPooled(process.env.DATABASE_URL);
}

const unpooled = resolveUnpooledUrl();
if (!unpooled) {
  console.error(
    "\n[ensure-db-env] Missing database URL for Prisma migrations.\n" +
      "Set one of these in Vercel → Environment Variables:\n" +
      "  • DATABASE_URL_UNPOOLED (Neon direct connection)\n" +
      "  • DIRECT_URL\n" +
      "  • POSTGRES_URL_NON_POOLING\n" +
      "  • or DATABASE_URL (pooled Neon URL — we will strip -pooler automatically)\n",
  );
  process.exit(1);
}

process.env.DATABASE_URL_UNPOOLED = unpooled;

const envPath = path.join(process.cwd(), ".env");
let lines = [];
if (fs.existsSync(envPath)) {
  lines = fs.readFileSync(envPath, "utf8").split("\n");
  lines = lines.filter((line) => !line.startsWith("DATABASE_URL_UNPOOLED="));
}
lines.push(`DATABASE_URL_UNPOOLED="${unpooled.replace(/"/g, '\\"')}"`);
fs.writeFileSync(envPath, lines.filter(Boolean).join("\n") + "\n");

console.log("[ensure-db-env] DATABASE_URL_UNPOOLED ready for Prisma");
